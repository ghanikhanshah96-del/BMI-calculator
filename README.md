# FitnessCalculatorPro.com

FitnessCalculatorPro.com is a two-tone health calculator website built with Next.js. It includes practical calculators and educational pages for everyday wellness planning.

## Features

- BMI calculator with category and healthy weight range
- TDEE and BMR calorie estimator
- Macro planner for protein, carbs, and fat targets
- Body fat percentage estimator
- Pregnancy due date calculator
- Ovulation and fertile window estimator
- Blog, privacy policy, and terms pages
- Responsive layout with shared navigation and footer
- SEO metadata and structured data for the home page

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React icons

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Scripts

```bash
npm run dev          # development server
npm run build        # production build
npm run start        # serve the production build
npm run lint         # ESLint
npm run icons        # rebuild public/icons.svg from Lucide icons
npm run og           # rebuild public/og-image.jpg and public/logo.png
npm run audit:serve  # build + serve on localhost:3100 for SEO crawlers
```

Copy `.env.example` to `.env.local` and fill in the Resend values to enable the contact form.

## Firebase

Set `NEXT_PUBLIC_FIREBASE_*` from Firebase Console > Project settings > Your apps in `.env.local`. Use plain hostnames for auth domain and storage bucket. Preserve existing local environment values when adding these. The root layout initializes Firebase Analytics only in supported browsers and replaces the previous standalone Analytics tag.

Browser configuration is public in built JavaScript. Environment files keep values out of Git, but do not make browser values secret. Protect data with Firebase Security Rules and App Check and restrict the browser API key to the required APIs. Never put private credentials in `NEXT_PUBLIC_*` variables.

Firestore blog access uses the separate server-only Admin SDK. Set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` using a service account authorized for the intended blog project. Browser configuration alone cannot enable Admin access.

Set these environment variables in your hosting provider before building production, then rebuild when public values change. Environment files (except the example), common service account filenames, and private key files are ignored by Git.

The package override keeps Firebase's transitive `@grpc/grpc-js` dependency on a patched version rather than its older pinned minor release.

Verify with `npm test`, `npm run lint`, and `npm run build`. Confirm live event delivery by opening the deployed site with analytics allowed and checking the configured property's Google Analytics Realtime report.

## Project Structure

```text
app/
  [tool]/          calculator pages and per-tool layouts
  about/           about page
  api/             contact form endpoints
  blog/            blog index and posts
  calculators/     all-calculators page
  components/      shared UI and the calculator widgets
  contact/         contact page and form
  lib/             tool data, SEO helpers, validation
  privacy/ terms/ sitemap-page/
  globals.css
  layout.tsx
  page.tsx
public/            images, icons sprite, OG image, logo
scripts/           build helpers (icons, OG image, polyfill patch, audit server)
```

## Notes

Calculator results are educational estimates only and are not medical advice, diagnosis, or treatment. Users should speak with a qualified health professional for personal medical decisions.

## Integrated admin

The admin is available at /admin, using FitnessCalculatorPro branding and the public website blog data. See [ADMIN-INTEGRATION.md](ADMIN-INTEGRATION.md) for setup, API routes and verification. Run npm run admin:check for a read-only backend configuration check.

## Reviews

The homepage includes visitor reviews, and /admin/reviews provides permission-controlled moderation. See [ADMIN-INTEGRATION.md](ADMIN-INTEGRATION.md) for rating visibility, live updates, email configuration, durable images and verification.
