import { withAdminApi } from "@/app/lib/admin-api";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getStorage } from "firebase-admin/storage";
import sharp from "sharp";
import { requirePermission } from "@/app/lib/auth";
import { getFirebaseApp, getDb } from "@/app/lib/firebase-admin";
async function handlePOST(req: NextRequest) {
  const media = await requirePermission("media");
  if (!media.ok) {
    const blogs = await requirePermission("blogs");
    if (!blogs.ok)
      return NextResponse.json(
        { error: media.status === 401 ? "Unauthorized" : "Forbidden" },
        { status: media.status },
      );
  }
  const bucketName =
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !file.size)
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    if (file.size > 5 * 1024 * 1024)
      return NextResponse.json(
        { error: "Image must be under 5MB" },
        { status: 400 },
      );
    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif",
        "image/gif",
      ].includes(file.type)
    )
      return NextResponse.json(
        { error: "Use a JPG, PNG, WebP, AVIF or GIF image" },
        { status: 400 },
      );
    let buffer: Buffer;
    try {
      buffer = await sharp(Buffer.from(await file.arrayBuffer()), {
        limitInputPixels: 40000000,
      })
        .rotate()
        .resize({
          width: 2400,
          height: 2400,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toBuffer();
    } catch {
      return NextResponse.json(
        { error: "Invalid or unsupported image" },
        { status: 400 },
      );
    }
    const id = randomUUID();
    let url: string;
    if (process.env.MEDIA_STORAGE === "firestore" || !bucketName) {
      if (buffer.length > 800000)
        buffer = await sharp(buffer)
          .resize({
            width: 1200,
            height: 1200,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 65 })
          .toBuffer();
      if (buffer.length > 800000)
        return NextResponse.json(
          { error: "Please choose a smaller image" },
          { status: 400 },
        );
      await getDb()
        .collection("publicMedia")
        .doc(id)
        .set({ bytes: buffer, contentType: "image/webp" });
      url = `/api/media/${id}.webp`;
    } else {
      const token = randomUUID(),
        name = `uploads/blog/${id}.webp`;
      const bucket = getStorage(getFirebaseApp()).bucket(bucketName);
      await bucket
        .file(name)
        .save(buffer, {
          resumable: false,
          metadata: {
            contentType: "image/webp",
            cacheControl: "public,max-age=31536000,immutable",
            metadata: { firebaseStorageDownloadTokens: token },
          },
        });
      url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(name)}?alt=media&token=${token}`;
    }
    await getDb()
      .collection("adminMedia")
      .doc(id)
      .set({
        url,
        name: file.name.replace(/\.[^.]+$/, ".webp"),
        source: "upload",
        ext: "webp",
        size: buffer.length,
        modifiedAt: new Date().toISOString(),
      });
    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error("Admin upload failed", error);
    return NextResponse.json(
      {
        error: "Upload failed. Check Firebase Admin and Storage configuration.",
      },
      { status: 503 },
    );
  }
}

export const POST = withAdminApi(handlePOST);
