import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import sharp from "sharp";
const state = vi.hoisted(() => ({
  db: new Map<string, Map<string, Record<string, unknown>>>(),
  cookies: new Map<string, string>(),
  offline: false,
  savedImages: [] as Buffer[],
}));
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      state.cookies.has(name)
        ? { name, value: state.cookies.get(name) }
        : undefined,
    set: (name: string, value: string) => {
      state.cookies.set(name, value);
    },
  }),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("./email", () => ({
  sendEmail: vi.fn().mockResolvedValue(undefined),
  formatEmailError: (e: Error) => e.message,
}));
vi.mock("firebase-admin/storage", () => ({
  getStorage: () => ({
    bucket: () => ({
      name: "test-bucket",
      file: () => ({
        save: async (buffer: Buffer) => {
          state.savedImages.push(buffer);
        },
      }),
    }),
  }),
}));
vi.mock("./firebase-admin", () => {
  function collection(name: string) {
    if (state.offline) throw new Error("Database offline");
    if (!state.db.has(name)) state.db.set(name, new Map());
    const data = state.db.get(name)!;
    function query(filters: [string, unknown][] = [], max = Infinity) {
      return {
        where: (field: string, _op: string, value: unknown) =>
          query([...filters, [field, value]], max),
        limit: (limit: number) => query(filters, limit),
        orderBy: () => query(filters, max),
        get: async () => {
          const docs = [...data]
            .filter(([, d]) => filters.every(([key, val]) => d[key] === val))
            .slice(0, max)
            .map(([id, d]) => ({ id, exists: true, data: () => ({ ...d }) }));
          return { docs, empty: !docs.length };
        },
        doc: (id = crypto.randomUUID()) => ({
          id,
          get: async () => ({
            id,
            exists: data.has(id),
            data: () => ({ ...data.get(id) }),
          }),
          set: async (
            value: Record<string, unknown>,
            opts?: { merge: boolean },
          ) => {
            data.set(id, { ...(opts?.merge ? data.get(id) : {}), ...value });
          },
          update: async (value: Record<string, unknown>) => {
            if (!data.has(id)) throw new Error("Missing document");
            data.set(id, { ...data.get(id), ...value });
          },
          delete: async () => {
            data.delete(id);
          },
        }),
      };
    }
    return query();
  }
  return {
    BLOG_POSTS_COLLECTION: "blogPosts",
    getDb: () => ({
      collection,
      runTransaction: async (fn: (tx: unknown) => Promise<unknown>) => {
        const writes: (() => Promise<void>)[] = [];
        const result = await fn({
          get: (ref: { get: () => unknown }) => ref.get(),
          set: (ref: { set: (v: unknown) => Promise<void> }, value: unknown) =>
            writes.push(() => ref.set(value)),
          update: (
            ref: { update: (v: unknown) => Promise<void> },
            value: unknown,
          ) => writes.push(() => ref.update(value)),
          delete: (ref: { delete: () => Promise<void> }) =>
            writes.push(() => ref.delete()),
        });
        for (const write of writes) await write();
        return result;
      },
    }),
    getFirebaseApp: () => ({}),
    isFirebaseConfigured: () => true,
  };
});
import * as publicReviews from "../api/reviews/route";
import * as adminReviews from "../api/admin/reviews/route";
import * as adminReview from "../api/admin/reviews/[id]/route";
import * as mediaImage from "../api/media/[id]/route";
import * as login from "../api/admin/login/route";
import * as logout from "../api/admin/logout/route";
import * as blogs from "../api/admin/blogs/route";
import * as blog from "../api/admin/blogs/[id]/route";
import * as users from "../api/admin/users/route";
import * as user from "../api/admin/users/[id]/route";
import * as media from "../api/admin/media/route";
import * as upload from "../api/admin/upload/route";
import { getCatalogEntry, listCatalogEntries } from "../blog/catalog";
import { blogPosts } from "../blog/posts";
import { createAdminUser, hashPassword, verifyPassword } from "./admin-users";
import { requirePagePermission } from "./auth";
import { sendEmail } from "./email";
import { revalidatePath } from "next/cache";
function req(
  path: string,
  method = "GET",
  body?: unknown,
  headers: Record<string, string> = {},
) {
  return new NextRequest(`http://localhost:3000/api/admin/${path}`, {
    method,
    headers: {
      "x-forwarded-for": crypto.randomUUID(),
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
const context = (id: string) => ({ params: Promise.resolve({ id }) });
async function rootLogin() {
  const res = await login.POST(
    req("login", "POST", { username: "admin", password: "root-test-password" }),
    undefined,
  );
  expect(res.status).toBe(200);
}
beforeEach(() => {
  state.db.clear();
  state.cookies.clear();
  state.savedImages.length = 0;
  state.offline = false;
  vi.clearAllMocks();
  process.env.MEDIA_STORAGE = "bucket";
  process.env.REVIEWS_TO_EMAIL = "reviews@example.com";
  process.env.ADMIN_USERNAME = "admin";
  process.env.ADMIN_PASSWORD = "root-test-password";
  process.env.SESSION_SECRET = "test-secret-with-more-than-32-characters";
  process.env.FIREBASE_STORAGE_BUCKET = "test-bucket";
});
describe("integrated admin APIs and public catalog", () => {
  it("protects every admin endpoint without a session", async () => {
    const results = await Promise.all([
      blogs.GET(req("blogs"), undefined),
      blogs.POST(req("blogs", "POST", {}), undefined),
      blog.GET(req("blogs/id"), context("id")),
      blog.PUT(req("blogs/id", "PUT", {}), context("id")),
      blog.DELETE(req("blogs/id", "DELETE"), context("id")),
      users.GET(req("users"), undefined),
      users.POST(req("users", "POST", {}), undefined),
      user.PUT(req("users/id", "PUT", {}), context("id")),
      user.DELETE(req("users/id", "DELETE"), context("id")),
      media.GET(req("media"), undefined),
      upload.POST(req("upload", "POST"), undefined),
    ]);
    expect(results.map((r) => r.status)).toEqual(Array(11).fill(401));
  });
  it("authenticates, rejects wrong passwords, and logs out", async () => {
    expect(
      (
        await login.POST(
          req("login", "POST", { username: "admin", password: "wrong" }),
          undefined,
        )
      ).status,
    ).toBe(401);
    await rootLogin();
    expect(state.cookies.get("fcp_admin_session")).toBeTruthy();
    expect((await blogs.GET(req("blogs"), undefined)).status).toBe(200);
    expect((await logout.POST(req("logout", "POST"), undefined)).status).toBe(
      200,
    );
    expect((await blogs.GET(req("blogs"), undefined)).status).toBe(401);
  });
  it("creates drafts, publishes, renames, unpublishes, and deletes public posts", async () => {
    await rootLogin();
    const input = {
      title: "Integration Article",
      content: "<p>Safe content</p><script>alert(1)</script>",
      status: "draft",
      category: "BMI",
    };
    const created = await blogs.POST(req("blogs", "POST", input), undefined);
    expect(created.status).toBe(201);
    const record = await created.json();
    expect(record.content).not.toContain("script");
    expect(await getCatalogEntry(record.slug)).toBeNull();
    expect(
      (await blog.GET(req(`blogs/${record.id}`), context(record.id))).status,
    ).toBe(200);
    expect(
      (await blogs.POST(req("blogs", "POST", input), undefined)).status,
    ).toBe(409);
    expect(
      (
        await blog.PUT(
          req(`blogs/${record.id}`, "PUT", { ...input, status: "published" }),
          context(record.id),
        )
      ).status,
    ).toBe(200);
    expect((await getCatalogEntry(record.slug))?.kind).toBe("firestore");
    expect(
      (
        await blog.PUT(
          req(`blogs/${record.id}`, "PUT", {
            ...input,
            slug: "renamed-article",
            status: "published",
          }),
          context(record.id),
        )
      ).status,
    ).toBe(200);
    expect(await getCatalogEntry(record.slug)).toBeNull();
    expect(await getCatalogEntry("renamed-article")).toBeTruthy();
    await blog.PUT(
      req(`blogs/${record.id}`, "PUT", {
        ...input,
        slug: "renamed-article",
        status: "draft",
      }),
      context(record.id),
    );
    expect(await getCatalogEntry("renamed-article")).toBeNull();
    expect(
      (
        await blog.DELETE(
          req(`blogs/${record.id}`, "DELETE"),
          context(record.id),
        )
      ).status,
    ).toBe(200);
    expect(
      (await blog.GET(req(`blogs/${record.id}`), context(record.id))).status,
    ).toBe(404);
    expect(revalidatePath).toHaveBeenCalledWith("/blog");
    expect(revalidatePath).toHaveBeenCalledWith("/sitemap.xml");
    expect(revalidatePath).toHaveBeenCalledWith("/blog/integration-article");
  });
  it("lists and edits existing website articles without reviving drafts or deleted content", async () => {
    await rootLogin();
    const list = await (await blogs.GET(req("blogs"), undefined)).json();
    expect(list.length).toBe(blogPosts.length);
    const post = list[0];
    expect(post.content).toContain("<h2>");
    await blog.PUT(
      req(`blogs/${post.id}`, "PUT", {
        ...post,
        title: "Updated website article",
        status: "published",
      }),
      context(post.id),
    );
    const published = await getCatalogEntry(post.slug);
    expect(published?.card.title).toBe("Updated website article");
    expect(
      (await listCatalogEntries()).filter((p) => p.slug === post.slug),
    ).toHaveLength(1);
    await blog.PUT(
      req(`blogs/${post.id}`, "PUT", { ...post, status: "draft" }),
      context(post.id),
    );
    expect(await getCatalogEntry(post.slug)).toBeNull();
    expect((await listCatalogEntries()).some((p) => p.slug === post.slug)).toBe(
      false,
    );
    await blog.DELETE(req(`blogs/${post.id}`, "DELETE"), context(post.id));
    expect(await getCatalogEntry(post.slug)).toBeNull();
    expect(
      (await (await blogs.GET(req("blogs"), undefined)).json()).some(
        (p: { id: string }) => p.id === post.id,
      ),
    ).toBe(false);
  });
  it("keeps an original static slug hidden after renaming its article", async () => {
    await rootLogin();
    const post = (await (await blogs.GET(req("blogs"), undefined)).json())[0];
    await blog.PUT(
      req(`blogs/${post.id}`, "PUT", { ...post, slug: "new-static-slug" }),
      context(post.id),
    );
    expect(await getCatalogEntry(post.slug)).toBeNull();
    expect(await getCatalogEntry("new-static-slug")).toBeTruthy();
  });
  it("creates, updates, resets, and deletes users without exposing password hashes", async () => {
    await rootLogin();
    const result = await users.POST(
      req("users", "POST", {
        email: "editor@example.com",
        permissions: ["blogs"],
      }),
      undefined,
    );
    expect(result.status).toBe(201);
    const data = await result.json();
    expect(data.emailed).toBe(true);
    expect(JSON.stringify(data)).not.toContain("passwordHash");
    expect(sendEmail).toHaveBeenCalledOnce();
    expect(
      (
        await users.POST(
          req("users", "POST", {
            email: "editor@example.com",
            permissions: ["blogs"],
          }),
          undefined,
        )
      ).status,
    ).toBe(409);
    expect(
      JSON.stringify(await (await users.GET(req("users"), undefined)).json()),
    ).not.toContain("passwordHash");
    expect(
      (
        await user.PUT(
          req(`users/${data.user.id}`, "PUT", { permissions: ["media"] }),
          context(data.user.id),
        )
      ).status,
    ).toBe(200);
    expect(
      (
        await user.PUT(
          req(`users/${data.user.id}`, "PUT", { action: "resetPassword" }),
          context(data.user.id),
        )
      ).status,
    ).toBe(200);
    expect(
      (
        await user.DELETE(
          req(`users/${data.user.id}`, "DELETE"),
          context(data.user.id),
        )
      ).status,
    ).toBe(200);
  });
  it("enforces team permissions and revokes access immediately", async () => {
    const member = await createAdminUser({
      email: "limited@example.com",
      passwordPlain: "member-password",
      permissions: ["blogs"],
    });
    expect(
      (
        await login.POST(
          req("login", "POST", {
            username: member.email,
            password: "member-password",
          }),
          undefined,
        )
      ).status,
    ).toBe(200);
    expect((await users.GET(req("users"), undefined)).status).toBe(403);
    expect((await blogs.GET(req("blogs"), undefined)).status).toBe(200);
    await expect(requirePagePermission("/admin/users")).rejects.toThrow();
    state.db.get("adminUsers")!.get(member.id)!.permissions = ["media"];
    expect((await blogs.GET(req("blogs"), undefined)).status).toBe(403);
    state.db.get("adminUsers")!.delete(member.id);
    expect((await media.GET(req("media"), undefined)).status).toBe(401);
  });
  it("revokes existing sessions after a password reset", async () => {
    const member = await createAdminUser({
      email: "reset@example.com",
      passwordPlain: "member-password",
      permissions: ["blogs"],
    });
    await login.POST(
      req("login", "POST", {
        username: member.email,
        password: "member-password",
      }),
      undefined,
    );
    state.db.get("adminUsers")!.get(member.id)!.invitedAt = "2099-01-01";
    expect((await blogs.GET(req("blogs"), undefined)).status).toBe(401);
  });
  it("persists validated images to Storage and lists them in the media library", async () => {
    await rootLogin();
    const image = await sharp({
      create: { width: 10, height: 10, channels: 3, background: "green" },
    })
      .png()
      .toBuffer();
    const form = new FormData();
    form.append("file", new File([image], "cover.png", { type: "image/png" }));
    const response = await upload.POST(
      new NextRequest("http://localhost:3000/api/admin/upload", {
        method: "POST",
        body: form,
      }),
      undefined,
    );
    expect(response.status).toBe(201);
    const { url } = await response.json();
    expect(url).toContain("firebasestorage.googleapis.com");
    expect(state.savedImages.length).toBe(1);
    expect((await sharp(state.savedImages[0]).metadata()).format).toBe("webp");
    const result = await (await media.GET(req("media"), undefined)).json();
    expect(result.images).toContain(url);
    expect(result.images).toContain("/logo.png");
  });
  it("rejects executable SVGs and invalid image data", async () => {
    await rootLogin();
    for (const [type, name, contents] of [
      ["image/svg+xml", "bad.svg", "<svg onload=alert(1)></svg>"],
      ["image/png", "bad.png", "not-an-image"],
    ]) {
      const form = new FormData();
      form.append("file", new File([contents], name, { type }));
      expect(
        (
          await upload.POST(
            new NextRequest("http://localhost:3000/api/admin/upload", {
              method: "POST",
              body: form,
            }),
            undefined,
          )
        ).status,
      ).toBe(400);
    }
  });
  it("rejects cross-origin writes and invalid payloads", async () => {
    expect(
      (
        await login.POST(
          req("login", "POST", {}, { origin: "https://evil.example" }),
          undefined,
        )
      ).status,
    ).toBe(403);
    expect(
      (await login.POST(req("login", "POST", null), undefined)).status,
    ).toBe(400);
    await rootLogin();
    expect((await blogs.POST(req("blogs", "POST", {}), undefined)).status).toBe(
      400,
    );
  });
  it("rejects invalid blog dates, statuses, URLs, and malformed JSON", async () => {
    await rootLogin();
    for (const extra of [
      { date: "2026-02-30" },
      { status: "unknown" },
      { coverImage: "javascript:alert(1)" },
      { content: [] },
    ]) {
      expect(
        (
          await blogs.POST(
            req("blogs", "POST", { title: "Validation", ...extra }),
            undefined,
          )
        ).status,
      ).toBe(400);
    }
    expect(
      (await blogs.POST(req("blogs", "POST", null), undefined)).status,
    ).toBe(400);
    const malformed = new NextRequest("http://localhost:3000/api/admin/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    });
    expect((await blogs.POST(malformed, undefined)).status).toBe(400);
  });
  it("reports database outages as a structured service error", async () => {
    await rootLogin();
    state.offline = true;
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await blogs.GET(req("blogs"), undefined)).status).toBe(503);
    spy.mockRestore();
  });
  it("reports invite delivery failure while preserving the created user", async () => {
    await rootLogin();
    vi.mocked(sendEmail).mockRejectedValueOnce(
      new Error("Delivery unavailable"),
    );
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await users.POST(
      req("users", "POST", {
        email: "fallback@example.com",
        permissions: ["blogs"],
      }),
      undefined,
    );
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.warning).toContain("Delivery unavailable");
    expect(data.tempPassword).toBeTruthy();
    spy.mockRestore();
  });
  it("hashes passwords with separate salts and verifies them", () => {
    const first = hashPassword("secret");
    expect(first).not.toBe(hashPassword("secret"));
    expect(verifyPassword("secret", first)).toBe(true);
    expect(verifyPassword("wrong", first)).toBe(false);
  });
});

function reviewReq(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("http://localhost:3000/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}
describe("reviews and durable media integration", () => {
  it("saves each rating and publishes only 4?5 stars", async () => {
    for (let rating = 1; rating <= 5; rating++) {
      const response = await publicReviews.POST(
        reviewReq({ rating, name: "", comment: `Feedback ${rating}` }),
      );
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body.review.name).toBe("Anonymous user");
      expect(body.published).toBe(rating >= 4);
      const saved = state.db.get("userReviews")!.get(body.review.id)!;
      expect(saved.notificationStatus).toBe(
        rating >= 4 ? "not-required" : "sent",
      );
    }
    expect(sendEmail).toHaveBeenCalledTimes(3);
    const published = (await (await publicReviews.GET()).json()).reviews;
    expect(published).toHaveLength(2);
    expect(published.every((p: { rating: number }) => p.rating >= 4)).toBe(
      true,
    );
    expect(JSON.stringify(published)).not.toContain("notificationStatus");
    expect(JSON.stringify(published)).not.toContain("moderated");
  });
  it("enforces five submissions per network per day without saving the sixth", async () => {
    for (let n = 0; n < 5; n++)
      expect(
        (
          await publicReviews.POST(
            reviewReq({ rating: 5, comment: "Valid feedback" }),
          )
        ).status,
      ).toBe(201);
    expect(
      (
        await publicReviews.POST(
          reviewReq({ rating: 5, comment: "Sixth feedback" }),
        )
      ).status,
    ).toBe(429);
    expect(state.db.get("userReviews")?.size).toBe(5);
  });
  it("keeps feedback saved when notification delivery fails", async () => {
    vi.mocked(sendEmail).mockRejectedValueOnce(new Error("Provider offline"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await publicReviews.POST(
      reviewReq({ rating: 2, comment: "Please improve this tool" }),
    );
    expect(result.status).toBe(201);
    const body = await result.json();
    expect(
      state.db.get("userReviews")!.get(body.review.id)!.notificationStatus,
    ).toBe("failed");
    spy.mockRestore();
  });
  it("rejects malformed, oversized, cross-origin, and invalid review requests", async () => {
    for (const body of [
      null,
      { rating: 0, comment: "bad" },
      { rating: 4.5, comment: "bad" },
      { rating: 5, comment: "" },
      { rating: 5, comment: "a".repeat(281) },
      { rating: 5, name: "a".repeat(41), comment: "valid" },
    ])
      expect((await publicReviews.POST(reviewReq(body))).status).toBe(400);
    expect(
      (
        await publicReviews.POST(
          reviewReq(
            { rating: 5, comment: "valid" },
            { origin: "https://evil.example" },
          ),
        )
      ).status,
    ).toBe(403);
    expect(
      (await publicReviews.POST(reviewReq({ comment: "a".repeat(4100) })))
        .status,
    ).toBe(413);
    expect(state.db.get("userReviews")?.size || 0).toBe(0);
  });
  it("protects moderation with authentication and Reviews permission", async () => {
    expect((await adminReviews.GET(req("reviews"), undefined)).status).toBe(
      401,
    );
    expect(
      (await adminReview.PATCH(req("reviews/id", "PATCH", {}), context("id")))
        .status,
    ).toBe(401);
    expect(
      (await adminReview.DELETE(req("reviews/id", "DELETE"), context("id")))
        .status,
    ).toBe(401);
    const member = await createAdminUser({
      email: "blogonly@example.com",
      passwordPlain: "password",
      permissions: ["blogs"],
    });
    await login.POST(
      req("login", "POST", { username: member.email, password: "password" }),
      undefined,
    );
    expect((await adminReviews.GET(req("reviews"), undefined)).status).toBe(
      403,
    );
  });
  it("edits, hides and deletes reviews while preserving the first original snapshot", async () => {
    const created = await (
      await publicReviews.POST(
        reviewReq({
          rating: 5,
          name: "Original",
          comment: "Original feedback",
        }),
      )
    ).json();
    const id = created.review.id;
    await rootLogin();
    expect((await adminReviews.GET(req("reviews"), undefined)).status).toBe(
      200,
    );
    const input = {
      name: "Edited",
      comment: "Edited feedback",
      rating: 4,
      tool: "BMI",
      published: true,
    };
    expect(
      (
        await adminReview.PATCH(
          req(`reviews/${id}`, "PATCH", input),
          context(id),
        )
      ).status,
    ).toBe(200);
    expect(state.db.get("userReviews")!.get(id)!.originalReview).toEqual({
      name: "Original",
      rating: 5,
      comment: "Original feedback",
      tool: "",
    });
    expect(
      (
        await adminReview.PATCH(
          req(`reviews/${id}`, "PATCH", { ...input, rating: 2 }),
          context(id),
        )
      ).status,
    ).toBe(400);
    await adminReview.PATCH(
      req(`reviews/${id}`, "PATCH", { ...input, rating: 2, published: false }),
      context(id),
    );
    expect((await (await publicReviews.GET()).json()).reviews).toHaveLength(0);
    expect(state.db.get("userReviews")!.get(id)!.moderated).toBe(true);
    expect(state.db.get("userReviews")!.get(id)!.originalReview).toEqual({
      name: "Original",
      rating: 5,
      comment: "Original feedback",
      tool: "",
    });
    expect(sendEmail).not.toHaveBeenCalled();
    expect(
      (await adminReview.DELETE(req(`reviews/${id}`, "DELETE"), context(id)))
        .status,
    ).toBe(200);
    expect(
      (await adminReview.DELETE(req(`reviews/${id}`, "DELETE"), context(id)))
        .status,
    ).toBe(404);
  });
  it("serves optimized images persisted in Firestore when no bucket is provisioned", async () => {
    process.env.MEDIA_STORAGE = "firestore";
    await rootLogin();
    const image = await sharp({
      create: { width: 12, height: 12, channels: 3, background: "green" },
    })
      .png()
      .toBuffer();
    const form = new FormData();
    form.append("file", new File([image], "cover.png", { type: "image/png" }));
    const uploaded = await upload.POST(
      new NextRequest("http://localhost:3000/api/admin/upload", {
        method: "POST",
        body: form,
      }),
      undefined,
    );
    expect(uploaded.status).toBe(201);
    const { url } = await uploaded.json();
    expect(url).toMatch(/^\/api\/media\/.*\.webp$/);
    const id = url.split("/").pop();
    const served = await mediaImage.GET(req("unused"), context(id));
    expect(served.status).toBe(200);
    expect(served.headers.get("Content-Type")).toBe("image/webp");
    expect(
      (await sharp(Buffer.from(await served.arrayBuffer())).metadata()).format,
    ).toBe("webp");
    expect(
      (await (await media.GET(req("media"), undefined)).json()).images,
    ).toContain(url);
    expect(
      (await mediaImage.GET(req("unused"), context("bad-id"))).status,
    ).toBe(404);
  });
});
