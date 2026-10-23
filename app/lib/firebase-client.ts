import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import type { Analytics } from "firebase/analytics";

// Public browser configuration only. Never add Admin credentials here.
function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

export function getFirebaseClientApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  const config = getFirebaseConfig();
  if (!config.apiKey || !config.projectId || !config.appId) return null;
  return getApps().some((app) => app.name === "[DEFAULT]")
    ? getApp()
    : initializeApp(config);
}

let analyticsPromise: Promise<Analytics | null> | undefined;

export function initializeFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  const app = getFirebaseClientApp();
  if (!app || !getFirebaseConfig().measurementId) return Promise.resolve(null);
  analyticsPromise ??= import("firebase/analytics")
    .then(async ({ getAnalytics, isSupported }) =>
      (await isSupported()) ? getAnalytics(app) : null,
    )
    .catch(() => {
      console.warn("Firebase Analytics could not be initialized in this browser.");
      return null;
    });
  return analyticsPromise;
}
