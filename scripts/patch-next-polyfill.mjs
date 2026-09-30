// Next.js renders its legacy-browser polyfill as <script noModule src> without
// async/defer, which SEO crawlers report as render-blocking. Modern browsers
// skip noModule scripts entirely, so adding `defer` is safe. Idempotent.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextDist = path.join(root, "node_modules", "next", "dist");

if (!existsSync(nextDist)) process.exit(0);

const compiledDir = path.join(nextDist, "compiled", "next-server");
const targets = [
  path.join(nextDist, "server", "app-render", "app-render.js"),
  path.join(nextDist, "esm", "server", "app-render", "app-render.js"),
  ...(existsSync(compiledDir)
    ? readdirSync(compiledDir)
        .filter((name) => name.startsWith("app-page") && name.endsWith(".js"))
        .map((name) => path.join(compiledDir, name))
    : []),
];

const replacements = [
  [/noModule:!0,nonce:/g, "noModule:!0,defer:!0,nonce:"],
  [/noModule: true,(\r?\n\s*)nonce/g, "noModule: true,$1defer: true,$1nonce"],
];

let patched = 0;
for (const file of targets) {
  if (!existsSync(file)) continue;
  const src = readFileSync(file, "utf8");
  let out = src;
  for (const [pattern, replacement] of replacements) out = out.replace(pattern, replacement);
  if (out !== src) {
    writeFileSync(file, out);
    patched += 1;
  }
}

console.log(`patch-next-polyfill: ${patched} file(s) patched`);
