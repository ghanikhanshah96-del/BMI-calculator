import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sdk = vi.hoisted(() => ({
  getApps: vi.fn(),
  getApp: vi.fn(),
  initializeApp: vi.fn(),
  isSupported: vi.fn(),
  getAnalytics: vi.fn(),
}));

vi.mock("firebase/app", () => sdk);
vi.mock("firebase/analytics", () => sdk);

beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
  vi.stubGlobal("window", {});
  vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "test-key");
  vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "test-project");
  vi.stubEnv("NEXT_PUBLIC_FIREBASE_APP_ID", "test-app");
  vi.stubEnv("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID", "G-TEST");
  sdk.getApps.mockReturnValue([]);
  sdk.initializeApp.mockReturnValue({ name: "[DEFAULT]" });
  sdk.isSupported.mockResolvedValue(true);
  sdk.getAnalytics.mockReturnValue({ app: "test-app" });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("Firebase browser initialization", () => {
  it("does not initialize during server rendering", async () => {
    vi.stubGlobal("window", undefined);
    const { initializeFirebaseAnalytics } = await import("./firebase-client");
    expect(await initializeFirebaseAnalytics()).toBeNull();
    expect(sdk.initializeApp).not.toHaveBeenCalled();
  });

  it("skips initialization when required configuration is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "");
    const { initializeFirebaseAnalytics } = await import("./firebase-client");
    expect(await initializeFirebaseAnalytics()).toBeNull();
    expect(sdk.initializeApp).not.toHaveBeenCalled();
  });

  it("reuses the default app and initializes analytics once", async () => {
    sdk.getApps.mockReturnValue([{ name: "[DEFAULT]" }]);
    sdk.getApp.mockReturnValue({ name: "[DEFAULT]" });
    const { initializeFirebaseAnalytics } = await import("./firebase-client");
    const first = initializeFirebaseAnalytics();
    expect(initializeFirebaseAnalytics()).toBe(first);
    expect(await first).toEqual({ app: "test-app" });
    expect(sdk.initializeApp).not.toHaveBeenCalled();
    expect(sdk.getAnalytics).toHaveBeenCalledTimes(1);
  });

  it("skips analytics in unsupported browsers", async () => {
    sdk.isSupported.mockResolvedValue(false);
    const { initializeFirebaseAnalytics } = await import("./firebase-client");
    expect(await initializeFirebaseAnalytics()).toBeNull();
    expect(sdk.getAnalytics).not.toHaveBeenCalled();
  });

  it("keeps the site usable if analytics initialization fails", async () => {
    sdk.getAnalytics.mockImplementation(() => { throw new Error("Blocked"); });
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const { initializeFirebaseAnalytics } = await import("./firebase-client");
    expect(await initializeFirebaseAnalytics()).toBeNull();
  });
});
