export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getFileUrl } from "@/lib/s3";

// Helper to check if URL is an S3 key (not a full URL)
function isS3Key(value: string | null | undefined): boolean {
  if (!value) return false;
  // S3 keys don't start with http
  return !value.startsWith('http');
}

// Helper to get fresh signed URL for S3 keys
async function getSignedUrlIfNeeded(urlOrKey: string | null | undefined): Promise<string | null> {
  if (!urlOrKey) return null;
  if (isS3Key(urlOrKey)) {
    return await getFileUrl(urlOrKey);
  }
  return urlOrKey;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params?.slug;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug não fornecido" },
        { status: 400 }
      );
    }

    const store = await prisma.store.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          orderBy: [
            { displayOrder: "asc" },
            { createdAt: "desc" }
          ],
        },
      },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Loja não encontrada" },
        { status: 404 }
      );
    }

    // Generate fresh signed URLs for S3 images
    const logoUrl = store.logoKey 
      ? await getFileUrl(store.logoKey)
      : await getSignedUrlIfNeeded(store.logoUrl);
    
    const bannerUrl = store.bannerKey
      ? await getFileUrl(store.bannerKey)
      : await getSignedUrlIfNeeded(store.bannerUrl);

    // Process products with fresh signed URLs
    const productsWithUrls = await Promise.all(
      (store.products ?? []).map(async (p) => {
        // Get main image URL
        const mainImageUrl = p.mainImageKey
          ? await getFileUrl(p.mainImageKey)
          : await getSignedUrlIfNeeded(p.mainImageUrl);

        // Get gallery URLs
        const galleryUrls = await Promise.all(
          (p.galleryKeys?.length ? p.galleryKeys : p.galleryUrls ?? []).map(async (keyOrUrl) => {
            return await getSignedUrlIfNeeded(keyOrUrl);
          })
        );

        return {
          ...p,
          mainImageUrl: mainImageUrl ?? p.mainImageUrl,
          galleryUrls: galleryUrls.filter(Boolean) as string[],
          basePrice: p.basePrice ? Number(p.basePrice) : null,
          discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
        };
      })
    );

    const serializedStore = {
      ...store,
      logoUrl,
      bannerUrl,
      products: productsWithUrls,
    };

    return NextResponse.json({ store: serializedStore });
  } catch (error) {
    console.error("Get public store error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar loja" },
      { status: 500 }
    );
  }
}
