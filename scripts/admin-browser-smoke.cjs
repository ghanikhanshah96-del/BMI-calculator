const { loadEnvConfig } = require("@next/env");
const { mkdir, writeFile } = require("node:fs/promises");
const path = require("node:path");
const assert = require("node:assert/strict");
loadEnvConfig(process.cwd());
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
(async () => {
  const out = path.resolve("artifacts/admin");
  await mkdir(out, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_PATH
      ? { executablePath: process.env.CHROMIUM_PATH }
      : {}),
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const base = process.env.SMOKE_BASE_URL || "http://localhost:3100";
  try {
    await page.goto(`${base}/admin`);
    await page.waitForURL("**/admin/login");
    assert(
      await page.getByRole("heading", { name: "Admin login" }).isVisible(),
    );
    assert(await page.getByAltText("FitnessCalculatorPro logo").isVisible());
    await page.screenshot({
      path: path.join(out, "login-desktop.png"),
      fullPage: true,
    });
    await page
      .getByLabel("Email or username")
      .fill(process.env.ADMIN_USERNAME || "admin");
    await page
      .getByLabel("Password", { exact: true })
      .fill(process.env.ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.waitForURL(`${base}/admin`);
    await page.getByText("Welcome back", { exact: false }).waitFor();
    await page.screenshot({
      path: path.join(out, "dashboard-desktop.png"),
      fullPage: true,
    });
    await page.goto(`${base}/admin/blogs/new`);
    await page.locator(".tox-tinymce").waitFor({ timeout: 60000 });
    const editorBody = page.frameLocator("iframe.tox-edit-area__iframe").locator("body");
    await editorBody.click();
    await editorBody.pressSequentially("Browser-tested editor content", { delay: 10 });
    await page.getByRole("tab", { name: "Text", exact: true }).click();
    assert((await page.locator('textarea[spellcheck="false"]').inputValue()).includes("Browser-tested editor content"));
    await page.getByRole("tab", { name: "Visual", exact: true }).click();
    await page.screenshot({
      path: path.join(out, "editor-desktop.png"),
      fullPage: true,
    });
    assert.equal(
      (await page.request.get(`${base}/api/admin/media`)).status(),
      200,
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/admin`);
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.screenshot({
      path: path.join(out, "dashboard-mobile.png"),
      fullPage: true,
    });
    assert(
      await page.getByRole("button", { name: "Log out" }).last().isVisible(),
    );
    await page.getByRole("button", { name: "Log out" }).last().click();
    await page.waitForURL("**/admin/login");
    assert.equal(
      (await page.request.get(`${base}/api/admin/blogs`)).status(),
      401,
    );
    assert.deepEqual(errors, []);
    await writeFile(
      path.join(out, "browser-result.json"),
      JSON.stringify(
        {
          passed: true,
          checked: [
            "auth redirect",
            "branding",
            "login",
            "dashboard",
            "TinyMCE editor typing",
            "media API",
            "mobile menu",
            "logout",
          ],
          pageErrors: errors,
          liveFirebase: "Pending Firebase Admin credentials",
        },
        null,
        2,
      ),
    );
    console.log(
      "Browser smoke passed: login, branding, dashboard, editor, media, mobile menu, logout. Live Firebase credentials still required.",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
