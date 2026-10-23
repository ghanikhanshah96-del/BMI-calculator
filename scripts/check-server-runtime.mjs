import assert from "node:assert/strict";
import { createRequire } from "node:module";

// Run before the build: successful compilation alone does not exercise external
// server modules, which previously crashed /admin and the blog/media APIs.
assert.equal(
  Number(process.versions.node.split(".")[0]),
  24,
  `Use Node.js 24.x for this project (current: ${process.version}). package.json selects the matching Vercel runtime.`,
);

const require = createRequire(import.meta.url);
const imported = require("isomorphic-dompurify");
const purifier = imported.default || imported;
const output = purifier.sanitize('<p>Runtime check</p><img src="/ok.png" onerror="alert(1)"><script>alert(1)</script>');
assert.ok(output.includes("Runtime check"));
assert.ok(!/onerror|<script/i.test(output), "Server HTML sanitization must stay enabled.");
console.log(`Server runtime OK: ${process.version}; DOMPurify/jsdom loaded and sanitized HTML.`);
