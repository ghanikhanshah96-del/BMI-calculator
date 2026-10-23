const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { cert, initializeApp, deleteApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const {
  randomUUID,
  randomBytes,
  scryptSync,
  createHmac,
} = require("node:crypto");
const { mkdir, writeFile } = require("node:fs/promises");
const assert = require("node:assert/strict");
const sharp = require("sharp");
(async () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  assert.equal(
    projectId,
    "fitnesscalculatorpro",
    "Refusing to test another Firebase project",
  );
  const app = initializeApp(
    {
      projectId,
      credential: cert({
        projectId,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    },
    "review-live-verification",
  );
  const db = getFirestore(app),
    token = randomUUID(),
    network = `verification-${token}`,
    base = process.env.SMOKE_BASE_URL || "http://localhost:3100";
  const cleanup = [],
    out = "artifacts/reviews";
  await mkdir(out, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_PATH
      ? { executablePath: process.env.CHROMIUM_PATH }
      : {}),
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    extraHTTPHeaders: { "x-forwarded-for": network },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const checks = [];
  try {
    await page.goto(base);
    await page
      .getByRole("button", { name: "Write a review", exact: true })
      .click();
    await page.getByRole("button", { name: "5 stars", exact: true }).click();
    const reviewName = `Integration ${token.slice(0, 8)}`;
    await page.getByLabel("Your name (optional)").fill(reviewName);
    await page
      .getByLabel("Your review", { exact: true })
      .fill(
        "Automated integration verification; this temporary record will be removed.",
      );
    const saved = page.waitForResponse(
      (response) =>
        response.url().endsWith("/api/reviews") &&
        response.request().method() === "POST",
    );
    await page
      .getByRole("button", { name: "Send review", exact: true })
      .click();
    const savedResponse = await saved;
    assert.equal(savedResponse.status(), 201);
    const data = await savedResponse.json();
    cleanup.push(["userReviews", data.review.id]);
    const quotaKey = createHmac(
      "sha256",
      process.env.REVIEWS_RATE_LIMIT_SECRET || process.env.SESSION_SECRET,
    )
      .update(`${network}:${new Date().toISOString().slice(0, 10)}`)
      .digest("hex");
    cleanup.push(["reviewSubmissionLimits", quotaKey]);
    assert.equal(data.published, true);
    assert.equal(
      (await db.collection("userReviews").doc(data.review.id).get()).data()
        .published,
      true,
    );
    await page
      .getByRole("button", { name: "Back to calculator", exact: true })
      .click();
    await page.getByText(reviewName, { exact: true }).waitFor();
    checks.push(
      "Public browser submission persists in Firestore and appears without reload",
    );
    await page.screenshot({
      path: `${out}/homepage-review.png`,
      fullPage: true,
    });
    // Verify live stream receipt separately, then cancel so no connection is left running.
    const stream = await fetch(`${base}/api/reviews/stream`);
    assert.equal(stream.status, 200);
    const reader = stream.body.getReader(),
      decoder = new TextDecoder();
    let streamData = "";
    const streamDeadline = setTimeout(() => reader.cancel(), 20000);
    try {
      while (!streamData.includes(data.review.id)) {
        const chunk = await reader.read();
        if (chunk.done) break;
        streamData += decoder.decode(chunk.value);
      }
      assert(streamData.includes(data.review.id));
    } finally {
      clearTimeout(streamDeadline);
      await reader.cancel();
    }
    checks.push("Firestore review snapshot arrives over SSE");
    await page.goto(`${base}/admin/login`);
    await page
      .getByLabel("Email or username")
      .fill(process.env.ADMIN_USERNAME || "admin");
    await page
      .getByLabel("Password", { exact: true })
      .fill(process.env.ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.waitForURL(`${base}/admin`);
    await page.goto(`${base}/admin/reviews`);
    await page
      .getByRole("searchbox", { name: "Search feedback" })
      .fill(reviewName);
    await page
      .getByRole("button", { name: `Edit review by ${reviewName}` })
      .first()
      .click();
    const dialog = page.getByRole("dialog", {
      name: "Edit review",
      exact: true,
    });
    await dialog.getByLabel("Rating", { exact: true }).selectOption("3");
    assert.equal(await dialog.getByRole("checkbox").isChecked(), false);
    assert.equal(await dialog.getByRole("checkbox").isDisabled(), true);
    await dialog
      .getByRole("button", { name: "Save changes", exact: true })
      .click();
    await dialog.waitFor({ state: "hidden" });
    const edited = (
      await db.collection("userReviews").doc(data.review.id).get()
    ).data();
    assert.equal(edited.published, false);
    assert.equal(edited.rating, 3);
    assert.equal(edited.originalReview.rating, 5);
    assert.equal(edited.notificationStatus, "not-required");
    assert(
      !(
        await (await context.request.get(`${base}/api/reviews`)).json()
      ).reviews.some((review) => review.id === data.review.id),
    );
    checks.push(
      "Admin editing enforces private low ratings and preserves original snapshot",
    );
    await page.screenshot({ path: `${out}/admin-reviews.png`, fullPage: true });
    await page
      .getByRole("button", { name: `Delete review by ${reviewName}` })
      .first()
      .click();
    await page
      .getByRole("dialog", { name: "Delete review?", exact: true })
      .getByRole("button", { name: "Delete review", exact: true })
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.equal(
      (await db.collection("userReviews").doc(data.review.id).get()).exists,
      false,
    );
    checks.push("Admin confirmed deletion removes the document");
    const image = await sharp({
      create: { width: 32, height: 32, channels: 3, background: "#047857" },
    })
      .png()
      .toBuffer();
    const upload = await context.request.post(`${base}/api/admin/upload`, {
      multipart: {
        file: {
          name: "integration-test.png",
          mimeType: "image/png",
          buffer: image,
        },
      },
    });
    assert.equal(upload.status(), 201);
    const { url } = await upload.json();
    const mediaId = url
      .split("/")
      .pop()
      .replace(/\.webp$/, "");
    cleanup.push(["adminMedia", mediaId], ["publicMedia", mediaId]);
    const imageResponse = await context.request.get(`${base}${url}`);
    assert.equal(imageResponse.status(), 200);
    assert.equal(
      (await sharp(await imageResponse.body()).metadata()).format,
      "webp",
    );
    const bytes = (await db.collection("publicMedia").doc(mediaId).get()).data()
      .bytes;
    assert(Buffer.isBuffer(bytes));
    const library = await (
      await context.request.get(`${base}/api/admin/media`)
    ).json();
    assert(library.images.includes(url));
    checks.push(
      "Image upload, durable bytes, public download and media listing",
    );
    const article = {
      title: "Temporary integration verification",
      slug: `integration-${token}`,
      content: "<p>Temporary verification content.</p>",
      status: "draft",
      category: "TDEE",
    };
    const createBlog = await context.request.post(`${base}/api/admin/blogs`, {
      data: article,
    });
    assert.equal(createBlog.status(), 201);
    const post = await createBlog.json();
    cleanup.push(["blogPosts", post.id]);
    assert.equal(
      (await context.request.get(`${base}/blog/${article.slug}`)).status(),
      404,
    );
    assert.equal(
      (
        await context.request.put(`${base}/api/admin/blogs/${post.id}`, {
          data: { ...article, status: "published" },
        })
      ).status(),
      200,
    );
    assert.equal(
      (await context.request.get(`${base}/blog/${article.slug}`)).status(),
      200,
    );
    assert.equal(
      (
        await context.request.put(`${base}/api/admin/blogs/${post.id}`, {
          data: article,
        })
      ).status(),
      200,
    );
    assert.equal(
      (await context.request.get(`${base}/blog/${article.slug}`)).status(),
      404,
    );
    assert.equal(
      (
        await context.request.delete(`${base}/api/admin/blogs/${post.id}`)
      ).status(),
      200,
    );
    checks.push(
      "Live blog draft, publication, cache refresh, unpublication and deletion",
    );
    // A local fixture avoids sending an invitation email during verification.
    const userId = `integration-${token}`,
      password = randomBytes(24).toString("hex"),
      salt = randomBytes(16).toString("hex"),
      email = `integration-${token}@example.com`,
      now = new Date().toISOString();
    await db
      .collection("adminUsers")
      .doc(userId)
      .set({
        email,
        permissions: ["reviews"],
        passwordHash: `${salt}:${scryptSync(password, salt, 64).toString("hex")}`,
        active: true,
        createdAt: now,
        updatedAt: now,
        invitedAt: now,
      });
    cleanup.push(["adminUsers", userId]);
    const member = await browser.newContext({
      extraHTTPHeaders: { "x-forwarded-for": `member-${token}` },
    });
    try {
      assert.equal(
        (
          await member.request.post(`${base}/api/admin/login`, {
            data: { username: email, password },
          })
        ).status(),
        200,
      );
      assert.equal(
        (await member.request.get(`${base}/api/admin/reviews`)).status(),
        200,
      );
      assert.equal(
        (await member.request.get(`${base}/api/admin/users`)).status(),
        403,
      );
      assert.equal(
        (
          await context.request.put(`${base}/api/admin/users/${userId}`, {
            data: { permissions: ["blogs"] },
          })
        ).status(),
        200,
      );
      assert.equal(
        (await member.request.get(`${base}/api/admin/reviews`)).status(),
        403,
      );
      assert.equal(
        (
          await context.request.delete(`${base}/api/admin/users/${userId}`)
        ).status(),
        200,
      );
      assert.equal(
        (await member.request.get(`${base}/api/admin/blogs`)).status(),
        401,
      );
    } finally {
      await member.close();
    }
    checks.push(
      "Live team login, Reviews permission, permission refresh and session revocation",
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/admin/reviews`);
    await page.getByRole("heading", { name: "Customer feedback" }).waitFor();
    await page.screenshot({
      path: `${out}/reviews-mobile.png`,
      fullPage: true,
    });
    assert.deepEqual(errors, []);
    checks.push("Responsive review admin with no browser JavaScript errors");
    await writeFile(
      `${out}/live-result.json`,
      JSON.stringify(
        {
          passed: true,
          project: projectId,
          checks,
          emailDelivery:
            "Not sent during verification; mocked transport tests cover delivery handling",
          pageErrors: errors,
        },
        null,
        2,
      ),
    );
    console.log(JSON.stringify({ passed: true, checks }, null, 2));
  } finally {
    for (const [collection, id] of cleanup)
      await db.collection(collection).doc(id).delete();
    await browser.close();
    await deleteApp(app);
    console.log(
      "Removed temporary review, quota, image, article and user records.",
    );
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
