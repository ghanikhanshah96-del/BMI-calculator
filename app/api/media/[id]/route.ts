import { getDb } from "@/app/lib/firebase-admin";
export const runtime = "nodejs";
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!/^[a-f0-9-]{36}\.webp$/.test(id))
    return new Response("Not found", { status: 404 });
  try {
    const snapshot = await getDb()
      .collection("publicMedia")
      .doc(id.slice(0, -5))
      .get();
    if (!snapshot.exists) return new Response("Not found", { status: 404 });
    const data = snapshot.data()!;
    if (!Buffer.isBuffer(data.bytes))
      return new Response("Not found", { status: 404 });
    return new Response(new Uint8Array(data.bytes), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public,max-age=31536000,immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Image unavailable", { status: 503 });
  }
}
