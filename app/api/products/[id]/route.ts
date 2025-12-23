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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const userId = (session.user as any)?.id;
    const productId = params?.id;

    const store = await prisma.store.findUnique({
      where: { userId },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Loja não encontrada" },
        { status: 404 }
      );
    }

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        storeId: store.id,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Generate fresh signed URLs
    const mainImageUrl = product.mainImageKey
      ? await getFileUrl(product.mainImageKey)
      : await getSignedUrlIfNeeded(product.mainImageUrl);

    const galleryUrls = await Promise.all(
      (product.galleryKeys?.length ? product.galleryKeys : product.galleryUrls ?? []).map(async (keyOrUrl) => {
        return await getSignedUrlIfNeeded(keyOrUrl);
      })
    );

    const serializedProduct = {
      ...product,
      mainImageUrl: mainImageUrl ?? product.mainImageUrl,
      galleryUrls: galleryUrls.filter(Boolean) as string[],
      basePrice: product.basePrice ? Number(product.basePrice) : null,
      discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
    };

    return NextResponse.json({ product: serializedProduct });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produto" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const userId = (session.user as any)?.id;
    const productId = params?.id;
    const body = await request.json();

    const store = await prisma.store.findUnique({
      where: { userId },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Loja não encontrada" },
        { status: 404 }
      );
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        storeId: store.id,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    const updateData: any = {};

    if (body?.name !== undefined) updateData.name = body.name;
    if (body?.category !== undefined) updateData.category = body.category;
    if (body?.mainImageKey !== undefined) updateData.mainImageKey = body.mainImageKey;
    if (body?.mainImageUrl !== undefined) updateData.mainImageUrl = body.mainImageUrl;
    if (body?.galleryKeys !== undefined) updateData.galleryKeys = body.galleryKeys;
    if (body?.galleryUrls !== undefined) updateData.galleryUrls = body.galleryUrls;
    if (body?.basePrice !== undefined) {
      updateData.basePrice = body.basePrice ? parseFloat(body.basePrice) : null;
    }
    if (body?.discountPrice !== undefined) {
      updateData.discountPrice = body.discountPrice ? parseFloat(body.discountPrice) : null;
    }
    if (body?.showPrice !== undefined) updateData.showPrice = body.showPrice;
    if (body?.hasDiscount !== undefined) updateData.hasDiscount = body.hasDiscount;
    if (body?.motorPower !== undefined) updateData.motorPower = body.motorPower;
    if (body?.autonomy !== undefined) updateData.autonomy = body.autonomy;
    if (body?.battery !== undefined) updateData.battery = body.battery;
    if (body?.maxSpeed !== undefined) updateData.maxSpeed = body.maxSpeed;
    if (body?.chargeTime !== undefined) updateData.chargeTime = body.chargeTime;
    if (body?.maxWeight !== undefined) updateData.maxWeight = body.maxWeight;
    if (body?.availableColors !== undefined) updateData.availableColors = body.availableColors;
    if (body?.technicalDetails !== undefined) updateData.technicalDetails = body.technicalDetails;
    if (body?.isActive !== undefined) updateData.isActive = body.isActive;

    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    const serializedProduct = {
      ...product,
      basePrice: product.basePrice ? Number(product.basePrice) : null,
      discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
    };

    return NextResponse.json({ product: serializedProduct });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const userId = (session.user as any)?.id;
    const productId = params?.id;

    const store = await prisma.store.findUnique({
      where: { userId },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Loja não encontrada" },
        { status: 404 }
      );
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        storeId: store.id,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Erro ao excluir produto" },
      { status: 500 }
    );
  }
}
