import "server-only";

import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function getPrivateKey() {
  const key = process.env.FIREBASE_PRIVATE_KEY;
  if (!key) return undefined;
  return key.replace(/\\n/g, "\n");
}

function assertNotStellixFirebaseProject(projectId: string) {
  const id = projectId.toLowerCase();
  if (id.includes("stellixsoft") || id.includes("stellix-soft")) {
    throw new Error(
      `Refusing Firebase project "${projectId}". Use the FitnessCalculatorPro project only.`,
    );
  }
}

function createFirebaseApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.",
    );
  }

  assertNotStellixFirebaseProject(projectId);

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    projectId,
  });
}

const globalForFirebase = globalThis as unknown as {
  fcpFirebaseApp?: App;
  fcpFirestore?: Firestore;
};

export function getFirebaseApp(): App {
  if (!globalForFirebase.fcpFirebaseApp) {
    globalForFirebase.fcpFirebaseApp = createFirebaseApp();
  }
  return globalForFirebase.fcpFirebaseApp;
}

export function getDb(): Firestore {
  if (!globalForFirebase.fcpFirestore) {
    globalForFirebase.fcpFirestore = getFirestore(getFirebaseApp());
  }
  return globalForFirebase.fcpFirestore;
}

export const BLOG_POSTS_COLLECTION = "blogPosts";

export function isFirebaseConfigured(): boolean {
  return Boolean(
    (process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}
