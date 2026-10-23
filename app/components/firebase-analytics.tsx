"use client";

import { useEffect } from "react";
import { initializeFirebaseAnalytics } from "../lib/firebase-client";

export default function FirebaseAnalytics() {
  useEffect(() => {
    void initializeFirebaseAnalytics();
  }, []);
  return null;
}
