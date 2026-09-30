import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = (...p) => path.join(root, "public", ...p);

const icon = await readFile(path.join(root, "app", "icon.svg"));

await sharp(icon, { density: 1200 }).resize(512, 512).png().toFile(pub("logo.png"));

const W = 1200;
const H = 630;
const photoW = 480;

const photo = await sharp(pub("images", "hero-person.jpg"))
  .resize(photoW, H, { fit: "cover", position: "attention" })
  .toBuffer();

const iconPng = await sharp(icon, { density: 600 }).resize(96, 96).png().toBuffer();

const overlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#022c22"/>
      <stop offset="1" stop-color="#065f46"/>
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#064e3b" stop-opacity="1"/>
      <stop offset="1" stop-color="#064e3b" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W - photoW + 2}" height="${H}" fill="url(#bg)"/>
  <rect x="${W - photoW}" width="140" height="${H}" fill="url(#fade)"/>
  <text x="72" y="236" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="600" fill="#6ee7b7">FitnessCalculatorPro.com</text>
  <text x="72" y="316" font-family="Segoe UI, Arial, sans-serif" font-size="64" font-weight="800" fill="#ffffff">Free Fitness and</text>
  <text x="72" y="392" font-family="Segoe UI, Arial, sans-serif" font-size="64" font-weight="800" fill="#ffffff">Health Calculators</text>
  <text x="72" y="462" font-family="Segoe UI, Arial, sans-serif" font-size="28" fill="#d1fae5">BMI, body fat, TDEE, macros, due date, ovulation</text>
  <rect x="72" y="512" width="248" height="56" rx="28" fill="#10b981"/>
  <text x="196" y="549" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="700" fill="#022c22">Calculate now</text>
</svg>`;

await sharp({ create: { width: W, height: H, channels: 3, background: "#064e3b" } })
  .composite([
    { input: photo, left: W - photoW, top: 0 },
    { input: Buffer.from(overlay), left: 0, top: 0 },
    { input: iconPng, left: 72, top: 96 },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(pub("og-image.jpg"));

console.log("wrote public/og-image.jpg and public/logo.png");
