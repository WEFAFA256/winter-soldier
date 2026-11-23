import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { isAdmin } from "@/lib/admin-auth";
import { validateVideo } from "@/lib/video-validation";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;
    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "No video uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const invalid = validateVideo({ type: file.type, size: file.size }, buffer);
    if (invalid) {
      return NextResponse.json({ error: invalid }, { status: 415 });
    }

    const result: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "serenity_site_assets/videos",
          resource_type: "video",
        },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json(
      {
        secure_url: result.secure_url,
        public_id: result.public_id,
        duration: result.duration || 0,
        format: result.format || "",
        bytes: result.bytes || buffer.length,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error uploading video to Cloudinary:", error?.message || error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
