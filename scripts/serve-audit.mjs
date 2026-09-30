// Builds and serves the production site so canonical, sitemap, and robots URLs
// match the host an SEO crawler visits locally. Usage: npm run audit:serve [-- 3100]
import { spawnSync, spawn } from "node:child_process";

const port = process.argv[2] || "3100";
const env = { ...process.env, NEXT_PUBLIC_SITE_URL: `http://localhost:${port}` };

const build = spawnSync("npx", ["next", "build"], { stdio: "inherit", shell: true, env });
if (build.status !== 0) process.exit(build.status ?? 1);

console.log(`\nCrawl http://localhost:${port}/ (with the trailing slash) in your SEO tool.\n`);
spawn("npx", ["next", "start", "-p", port], { stdio: "inherit", shell: true, env });
