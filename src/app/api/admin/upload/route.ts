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
    const mimeType = file.type || "application/octet-stream";
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    
    // Save directly to public/uploads for direct HTTP stream & static serving
    try {
      const uploadsDir = join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });
      const filePath = join(uploadsDir, filename);
      await writeFile(filePath, buffer);

      const publicUrl = `/uploads/${filename}`;
      return NextResponse.json({ url: publicUrl, message: "Upload success" });
    } catch (fsErr: any) {
      // Fallback for readonly serverless environments (images only)
      if (!mimeType.startsWith("video/")) {
        const base64Data = buffer.toString("base64");
        const dataUrl = `data:${mimeType};base64,${base64Data}`;
        return NextResponse.json({ url: dataUrl, message: "Upload success" });
      }
      throw new Error("Unable to save video file to server storage: " + fsErr.message);
    }
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file." }, { status: 500 });
  }
}
