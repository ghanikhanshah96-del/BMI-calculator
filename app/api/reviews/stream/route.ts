import { getDb, isFirebaseConfigured } from "@/app/lib/firebase-admin";
import { REVIEWS_COLLECTION } from "@/app/lib/reviews-repo";
import { selectPublicReviews } from "@/app/lib/review-policy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  if (!isFirebaseConfigured()) {
    return Response.json(
      { message: "Reviews are temporarily unavailable." },
      { status: 503 },
    );
  }
  const encoder = new TextEncoder();
  let cancelled = false;
  let cleanup = () => {};
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;
      let unsubscribe = () => {};
      let heartbeat: ReturnType<typeof setInterval> | undefined;
      let lifetime: ReturnType<typeof setTimeout> | undefined;
      cleanup = () => {
        if (closed) return;
        closed = true;
        unsubscribe();
        clearInterval(heartbeat);
        clearTimeout(lifetime);
        request.signal.removeEventListener("abort", cleanup);
        if (!cancelled) controller.close();
      };
      const send = (value: string) => {
        if (!closed) controller.enqueue(encoder.encode(value));
      };
      try {
        send("retry: 3000\n\n");
        unsubscribe = getDb()
          .collection(REVIEWS_COLLECTION)
          .where("published", "==", true)
          .onSnapshot(
            (snapshot) => {
              const reviews = selectPublicReviews(
                snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })),
              );
              send(`data: ${JSON.stringify({ reviews })}\n\n`);
            },
            () => {
              send("event: unavailable\ndata: {}\n\n");
              cleanup();
            },
          );
        heartbeat = setInterval(() => send(": keepalive\n\n"), 15000);
        // Bound each connection; EventSource reconnects automatically.
        lifetime = setTimeout(cleanup, 240000);
        request.signal.addEventListener("abort", cleanup, { once: true });
        if (request.signal.aborted) cleanup();
      } catch {
        send("event: unavailable\ndata: {}\n\n");
        cleanup();
      }
    },
    cancel() {
      cancelled = true;
      cleanup();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
