export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getFileUrl } from "@/lib/s3";

// Helper to check if URL is an S3 key (not a full URL)
function isS3Key(value: string | null | undefined): boolean {
  if (!value) return false;
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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const userId = (session.user as any)?.id;

    const store = await prisma.store.findUnique({
      where: { userId },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Loja não encontrada" },
        { status: 404 }
      );
    }

    const products = await prisma.product.findMany({
      where: { storeId: store.id },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" }
      ],
    });

    // Generate fresh signed URLs for products
    const serializedProducts = await Promise.all(
      (products ?? []).map(async (p) => {
        const mainImageUrl = p.mainImageKey
          ? await getFileUrl(p.mainImageKey)
          : await getSignedUrlIfNeeded(p.mainImageUrl);

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

    return NextResponse.json({ products: serializedProducts });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
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

    const userId = (session.user as any)?.id;
    const body = await request.json();

    const store = await prisma.store.findUnique({
      where: { userId },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!store) {
      return NextResponse.json(
        { error: "Loja não encontrada" },
        { status: 404 }
      );
    }

    // Verificar limite de produtos
    const currentProductCount = store._count.products;
    const maxProducts = store.maxProducts || 20;
    
    if (currentProductCount >= maxProducts) {
      return NextResponse.json(
        { 
          error: `Limite de produtos atingido. Você pode cadastrar até ${maxProducts} produtos. Entre em contato com o suporte para aumentar seu limite.` 
        },
        { status: 403 }
      );
    }

    const { name, category, mainImageUrl, mainImageKey } = body ?? {};

    if (!name || !category || !mainImageUrl) {
      return NextResponse.json(
        { error: "Nome, categoria e imagem principal são obrigatórios" },
        { status: 400 }
      );
    }

    // Get the highest displayOrder to add new product at the end
    const maxOrderProduct = await prisma.product.findFirst({
      where: { storeId: store.id },
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });

    const nextOrder = (maxOrderProduct?.displayOrder ?? -1) + 1;

    const product = await prisma.product.create({
      data: {
        storeId: store.id,
        name,
        category,
        mainImageKey: mainImageKey ?? null,
        mainImageUrl,
        galleryKeys: body?.galleryKeys ?? [],
        galleryUrls: body?.galleryUrls ?? [],
        basePrice: body?.basePrice ? parseFloat(body.basePrice) : null,
        discountPrice: body?.discountPrice ? parseFloat(body.discountPrice) : null,
        showPrice: body?.showPrice ?? true,
        hasDiscount: body?.hasDiscount ?? false,
        motorPower: body?.motorPower ?? null,
        autonomy: body?.autonomy ?? null,
        battery: body?.battery ?? null,
        maxSpeed: body?.maxSpeed ?? null,
        chargeTime: body?.chargeTime ?? null,
        maxWeight: body?.maxWeight ?? null,
        availableColors: body?.availableColors ?? [],
        technicalDetails: body?.technicalDetails ?? null,
        isActive: body?.isActive ?? true,
        displayOrder: nextOrder,
      },
    });

    const serializedProduct = {
      ...product,
      basePrice: product.basePrice ? Number(product.basePrice) : null,
      discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
    };

    return NextResponse.json({ product: serializedProduct });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 }
    );
  }
}
