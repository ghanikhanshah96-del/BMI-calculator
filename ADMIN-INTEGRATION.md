# FitnessCalculatorPro admin and reviews

The admin runs inside this website at /admin. It uses the FitnessCalculatorPro logo, fonts and green palette. Local preview: http://localhost:3100/admin. The generated local login is in the ignored .admin-access.local.txt file.

## Firebase configuration

The provided service-account file was verified as belonging to fitnesscalculatorpro. Its server credentials are configured in the ignored .env.local file. They must also be configured in the hosting environment before deployment. Do not commit service-account JSON or private environment values.

Firestore access has been verified. The deployed Firestore rules deny all direct browser reads and writes; application APIs use the authorized Admin SDK. Browser Firebase settings initialize Analytics and do not expose server credentials.

Run npm run admin:check for read-only checks of database and media access.

## Reviews

- Visitors can use Write a review on the homepage without an account. Ratings are integers from 1 to 5; names are optional and limited to 40 characters; comments are required and limited to 280 characters; tool labels are limited to 80 characters.
- Only selected 4?5 star reviews appear publicly. This selection is disclosed on the homepage and form. Ratings of 1?3 stay private and trigger an attempted email alert.
- Reviews are stored in userReviews. Saving a review and its daily quota counter is one Firestore transaction, so a failed save does not consume the quota.
- Each network address can submit five reviews per UTC calendar day. The counter key is an HMAC using a server secret; raw addresses are not stored. Counters have expiresAt fields, but automatic cleanup still requires a Firestore TTL policy.
- Public responses include only public display fields and up to 40 reviews. Moderation details and notification statuses stay private.
- The homepage receives live Firestore updates through server-sent events. If streaming is unavailable, visible pages poll every 15 seconds. Streams send keepalives and reconnect after four minutes.
- A successful PNG/PDF report export schedules a prompt after 900 ms. Clipboard copying does not trigger it. Dismissals suppress automatic prompts for 14 days; successful submissions suppress them for 90 days. Manual homepage reviews remain available.
- /admin/reviews requires Reviews permission. It provides search, visibility/rating/email filters, ten-item pagination, editing and confirmed deletion. It refreshes every 15 seconds while visible and pauses refresh while dialogs are open.
- Ratings of 1?3 cannot be published. The first edit preserves originalReview, records the editing admin and timestamp, and leaves notification history intact. Editing does not send another email. Deletion permanently removes the document.

## Email

Complete SMTP settings take priority over Resend. Reviews, invitations and contact submissions use the shared email helper. Failed review notifications are recorded as failed without losing the review or asking visitors to resubmit. There is no automatic retry queue.

The current Resend key connects, but the account has no verified domain. Its test sender is restricted to the registered account address. Arbitrary invitation recipients require either a verified Resend sender domain or another configured transport.

Gmail SMTP can use these server environment fields:

    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=465
    SMTP_USER=your-address@gmail.com
    SMTP_PASS=your-Google-App-Password
    SMTP_FROM=FitnessCalculatorPro <your-address@gmail.com>
    REVIEWS_TO_EMAIL=your-inbox@example.com

Gmail App Passwords require 2-Step Verification and availability depends on account policy. Keep the App Password out of Git and chat. Never use a normal Google account password here.

Live email messages were not sent during verification. Transport success, failure and provider selection were tested with mocks.

## Blogs and images

Published admin HTML uses explicit article typography for headings, links, nested bullet/numbered lists, images and horizontally scrollable tables. Heading anchors drive the same document navigation as bundled articles. On mobile, contents collapse above the article and the calculator sidebar follows the reading content. Blog listing and both article templates disable hero/footer background photos; cover images, including `/api/media/` URLs, render inside the article at their natural aspect ratio. Existing saved posts receive these presentation changes without republishing.

Admin blog changes use the same blogPosts collection as the public catalog. Existing bundled articles are editable through Firestore overrides. Draft/deleted overrides suppress the bundled copy; renaming also suppresses its old URL. Mutations invalidate articles, the blog and sitemaps.

The Firebase project currently has no Storage bucket. MEDIA_STORAGE=firestore provides durable images without a separate bucket: uploads are validated, converted to WebP, and capped at 800,000 bytes. Bytes live in publicMedia; listing metadata lives separately in adminMedia. Public images are served through /api/media/[id].webp. These image URLs are intentionally public; do not upload private documents or medical data.

To use Firebase Storage later, provision an authorized bucket, set MEDIA_STORAGE=bucket and FIREBASE_STORAGE_BUCKET, then redeploy. The existing bucket upload adapter is retained.

## Verification

### Production sanitizer runtime

Use Node.js **24.x** locally and on Vercel. `package.json` declares that runtime and `.nvmrc` matches it. Vercel selects the Node runtime from the package engine requirement; confirm the new deployment uses Node 24 in its build settings/logs.

The admin dashboard, blog API and media API import the blog HTML sanitizer. Its jsdom dependency includes CommonJS-to-ES-module imports (`html-encoding-sniffer` -> `@exodus/bytes`). A runtime without that support crashes during module initialization, before authentication or Firestore access, producing `ERR_REQUIRE_ESM` and a generic 500 page. This is independent of the Firebase credential values.

`isomorphic-dompurify` is now explicitly externalized as one server package so Node loads its dependency graph natively. `npm run check:runtime` exercises that actual dependency and verifies HTML is still sanitized. It runs automatically before `npm run build`, so an incompatible build runtime fails clearly instead of shipping a compilation-only success. Do not disable sanitization or patch files inside `node_modules` as a workaround.

Vercel's serverless runtime can disable `require(ESM)` even when the Node 24 build machine passes the probe. Production logs from commit `0edda90` confirmed that selecting Node 24 and externalizing the package alone did not resolve this deployment. In Vercel Project Settings -> Environment Variables, explicitly set `NODE_OPTIONS` to `--experimental-require-module` for Production and Preview, then redeploy. Keep this platform setting in the dashboard, rather than Next's `env` configuration: it must take effect when Node starts, before any application modules load. If `NODE_OPTIONS` already contains necessary settings, preserve those and add the enabling flag; remove a conflicting `--no-experimental-require-module` flag.

This is the library maintainer's documented serverless workaround: https://github.com/kkomelin/isomorphic-dompurify/wiki/Workaround:-%60ERR_REQUIRE_ESM%60-on-Vercel---Netlify---AWS-Lambda . A regression test verifies that the real sanitizer starts and removes unsafe HTML with the explicit environment setting. A passing local check cannot establish that a deployed function received it; verify `/admin`, `/api/admin/blogs` and `/api/admin/media` on the new deployment. Signed-out requests should redirect to login or return 401, rather than 500. No Firebase, email, or admin-password changes are needed for this module-loader error.

Runtime-fix verification (2026-10-23): all 41 tests, lint, TypeScript and the production build passed on Node 24.13.0. Against the compiled local production server, signed-out admin requests redirected or returned 401 as expected; authenticated dashboard, blog list/editor, media, users and reviews pages returned 200, as did the blog and media APIs. These checks used read-only Firebase access and did not send email or create content. The live deployment still needs the updated code and runtime.

- npm test exercises real API handlers with mocked external services, including all review ratings, quotas, private/public filtering, email failures, moderation, permissions, revocation and both media adapters.
- npm run lint and npm run build check lint rules, TypeScript and production route generation.
- scripts/reviews-live-smoke.cjs runs browser and API checks against the real authorized Firebase project. It creates clearly identified temporary review, image, article, quota and user fixtures and removes them in finally. It does not send email. It requires Playwright and a running application; optional PLAYWRIGHT_MODULE, CHROMIUM_PATH and SMOKE_BASE_URL select the local tools/server.
- Live test results and screenshots are in the ignored artifacts/reviews directory. The verification covered browser review submission, SSE updates, moderation, deletion, durable image retrieval, blog lifecycle, team permissions and mobile layout.
- The original admin browser smoke script remains at scripts/admin-browser-smoke.cjs.

The existing fonts are now bundled locally with their SIL Open Font Licenses so builds do not depend on Google font downloads. Login throttling is per server process; deployments with multiple instances should add a shared gateway limit. Tests establish the checked behaviors rather than a universal reliability guarantee.
