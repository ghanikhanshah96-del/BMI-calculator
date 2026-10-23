import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const probe = fileURLToPath(new URL("./check-server-runtime.mjs", import.meta.url));

describe("production sanitizer startup", () => {
  it("loads the real external dependency graph and sanitizes HTML", () => {
    const result = spawnSync(process.execPath, [probe], { encoding: "utf8" });
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain("DOMPurify/jsdom loaded and sanitized HTML");
  });

  it("fails before build when the runtime cannot require the sanitizer's ESM dependencies", () => {
    const result = spawnSync(process.execPath, ["--no-experimental-require-module", probe], { encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("ERR_REQUIRE_ESM");
    expect(result.stderr).toContain("@exodus");
  });
});
