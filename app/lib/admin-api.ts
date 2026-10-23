import { NextRequest, NextResponse } from "next/server";
const loginAttempts = new Map<string, { count: number; until: number }>();
export function withAdminApi<T>(
  handler: (req: NextRequest, context: T) => Promise<Response>,
) {
  return async (req: NextRequest, context: T) => {
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      const origin = req.headers.get("origin");
      if (origin && origin !== req.nextUrl.origin)
        return NextResponse.json(
          { error: "Cross-origin request rejected" },
          { status: 403 },
        );
    }
    if (req.nextUrl.pathname === "/api/admin/login") {
      const key =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
      const now = Date.now();
      if (loginAttempts.size > 10000)
        for (const [id, value] of loginAttempts)
          if (value.until <= now) loginAttempts.delete(id);
      let attempt = loginAttempts.get(key);
      if (!attempt || attempt.until <= now) {
        attempt = { count: 0, until: now + 15 * 60 * 1000 };
        loginAttempts.set(key, attempt);
      }
      if (++attempt.count > 20)
        return NextResponse.json(
          { error: "Too many login attempts. Try again later." },
          { status: 429, headers: { "Retry-After": "900" } },
        );
    }
    try {
      if (
        ["POST", "PUT", "PATCH"].includes(req.method) &&
        req.headers.get("content-type")?.includes("application/json")
      ) {
        const body = await req.clone().json();
        if (!body || typeof body !== "object" || Array.isArray(body))
          return NextResponse.json(
            { error: "Expected a JSON object" },
            { status: 400 },
          );
      }
      const response = await handler(req, context);
      response.headers.set("Cache-Control", "no-store");
      return response;
    } catch (error) {
      if (error instanceof SyntaxError)
        return NextResponse.json(
          { error: "Invalid JSON request" },
          { status: 400 },
        );
      console.error("Admin API unavailable", error);
      return NextResponse.json(
        {
          error:
            "Admin service unavailable. Check server credentials and connectivity.",
        },
        { status: 503 },
      );
    }
  };
}
