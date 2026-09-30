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
