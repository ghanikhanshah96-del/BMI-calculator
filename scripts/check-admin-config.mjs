import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());

const missing = [
  "ADMIN_USERNAME",
  "ADMIN_PASSWORD",
  "SESSION_SECRET",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
].filter((key) => !process.env[key]?.trim());

if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32) {
  missing.push("SESSION_SECRET (minimum 32 characters)");
}

if (missing.length) {
  console.log("Admin configuration incomplete. Missing: " + missing.join(", "));
  console.log(
    "Browser Firebase settings cannot replace server service-account credentials.",
  );
  process.exitCode = 1;
} else {
  const { cert, initializeApp, deleteApp } = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");
  const { getStorage } = await import("firebase-admin/storage");
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (projectId !== "fitnesscalculatorpro")
    throw new Error("Use the authorized fitnesscalculatorpro project.");
  const app = initializeApp({
    projectId,
    credential: cert({
      projectId,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
  try {
    await getFirestore(app).collection("blogPosts").limit(1).get();
    console.log("Firestore blog access: OK");
    await getFirestore(app).collection("adminUsers").limit(1).get();
    console.log("Firestore admin-user access: OK");
    await getFirestore(app).collection("userReviews").limit(1).get();
    console.log("Firestore reviews access: OK");
    if (process.env.MEDIA_STORAGE === "firestore") {
      await getFirestore(app).collection("publicMedia").limit(1).get();
      console.log("Durable media storage: Firestore (optimized images)");
    } else {
      const bucket =
        process.env.FIREBASE_STORAGE_BUCKET ||
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
      if (!bucket)
        throw new Error(
          "Set FIREBASE_STORAGE_BUCKET or MEDIA_STORAGE=firestore",
        );
      const [exists] = await getStorage(app).bucket(bucket).exists();
      if (!exists)
        throw new Error("Storage bucket does not exist or is inaccessible");
      console.log("Firebase Storage bucket: OK");
    }
    console.log(
      "Email configuration: " +
        (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL
          ? "present; delivery unverified"
          : "incomplete"),
    );
  } catch (error) {
    console.error("Live admin check failed:", error.message);
    process.exitCode = 1;
  } finally {
    await deleteApp(app);
  }
}
