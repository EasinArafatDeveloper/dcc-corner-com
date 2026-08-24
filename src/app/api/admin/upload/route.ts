import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "image/jpeg";
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    // Optionally write local backup if filesystem is writable (localhost)
    try {
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const uploadsDir = join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });
      const path = join(uploadsDir, filename);
      await writeFile(path, buffer);
    } catch (fsErr) {
      // Ignored in serverless/Vercel environments where filesystem is read-only
    }

    // Return the universal data URL so images load 100% on both Vercel and localhost
    return NextResponse.json({ url: dataUrl, message: "Upload success" });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }
}
