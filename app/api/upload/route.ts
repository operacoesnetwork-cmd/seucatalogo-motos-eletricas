export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile, getFileUrl } from "@/lib/s3";
import sharp from "sharp";

async function convertToWebP(buffer: Buffer, contentType: string): Promise<{ buffer: Buffer; contentType: string }> {
  try {
    // Only convert image types
    if (!contentType?.startsWith?.("image/")) {
      return { buffer, contentType };
    }

    // Skip if already webp
    if (contentType === "image/webp") {
      return { buffer, contentType };
    }

    // Convert to WebP with quality optimization
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 85 })
      .toBuffer();

    return {
      buffer: webpBuffer,
      contentType: "image/webp",
    };
  } catch (error) {
    console.error("Error converting to WebP:", error);
    // Return original if conversion fails
    return { buffer, contentType };
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    const originalBuffer = Buffer.from(await file.arrayBuffer());
    const originalContentType = file.type ?? 'application/octet-stream';
    
    // Convert to WebP for optimization
    const { buffer, contentType } = await convertToWebP(originalBuffer, originalContentType);
    
    // Update filename extension if converted to webp
    let fileName = file.name?.replace(/[^a-zA-Z0-9.-]/g, "_") ?? 'file';
    if (contentType === "image/webp" && !fileName.endsWith(".webp")) {
      fileName = fileName.replace(/\.[^.]+$/, ".webp");
    }

    // Upload file and get signed URL
    const key = await uploadFile(buffer, fileName, contentType);
    const url = await getFileUrl(key);

    // Return both the key (for storage) and the signed URL (for immediate display)
    return NextResponse.json({ url, key });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload" },
      { status: 500 }
    );
  }
}
