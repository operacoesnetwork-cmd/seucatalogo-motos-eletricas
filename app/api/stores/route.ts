export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateSlug } from "@/lib/utils";
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
      include: {
        products: {
          orderBy: [
            { displayOrder: "asc" },
            { createdAt: "desc" }
          ],
        },
      },
    });

    if (!store) {
      return NextResponse.json({ store: null });
    }

    // Generate fresh signed URLs for store images
    const logoUrl = store.logoKey
      ? await getFileUrl(store.logoKey)
      : await getSignedUrlIfNeeded(store.logoUrl);

    const bannerUrl = store.bannerKey
      ? await getFileUrl(store.bannerKey)
      : await getSignedUrlIfNeeded(store.bannerUrl);

    // Generate fresh signed URLs for products
    const productsWithUrls = await Promise.all(
      (store.products ?? []).map(async (p) => {
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

    const serializedStore = {
      ...store,
      logoUrl,
      bannerUrl,
      products: productsWithUrls,
    };

    return NextResponse.json({ store: serializedStore });
  } catch (error) {
    console.error("Get store error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar loja" },
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
    const { name, whatsapp } = body ?? {};

    if (!name || !whatsapp) {
      return NextResponse.json(
        { error: "Nome e WhatsApp são obrigatórios" },
        { status: 400 }
      );
    }

    const existingStore = await prisma.store.findUnique({
      where: { userId },
    });

    if (existingStore) {
      return NextResponse.json(
        { error: "Você já possui uma loja cadastrada" },
        { status: 400 }
      );
    }

    let baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.store.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const store = await prisma.store.create({
      data: {
        userId,
        name,
        slug,
        whatsapp: whatsapp?.replace(/\D/g, "") ?? '',
        isSuspended: true,
        suspensionType: "pending_activation",
        suspendedReason: "Aguardando ativação pelo suporte",
        suspendedAt: new Date(),
      },
    });

    return NextResponse.json({ store });
  } catch (error) {
    console.error("Create store error:", error);
    return NextResponse.json(
      { error: "Erro ao criar loja" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    });

    if (!store) {
      return NextResponse.json(
        { error: "Loja não encontrada" },
        { status: 404 }
      );
    }

    const updateData: any = {};

    if (body?.name !== undefined) updateData.name = body.name;
    if (body?.description !== undefined) updateData.description = body.description;
    if (body?.logoKey !== undefined) updateData.logoKey = body.logoKey;
    if (body?.logoUrl !== undefined) updateData.logoUrl = body.logoUrl;
    if (body?.bannerKey !== undefined) updateData.bannerKey = body.bannerKey;
    if (body?.bannerUrl !== undefined) updateData.bannerUrl = body.bannerUrl;
    if (body?.primaryColor !== undefined) updateData.primaryColor = body.primaryColor;
    if (body?.secondaryColor !== undefined) updateData.secondaryColor = body.secondaryColor;
    if (body?.backgroundColor !== undefined) updateData.backgroundColor = body.backgroundColor;
    if (body?.whatsapp !== undefined) updateData.whatsapp = body.whatsapp?.replace(/\D/g, "") ?? '';
    if (body?.instagram !== undefined) updateData.instagram = body.instagram;
    if (body?.city !== undefined) updateData.city = body.city;
    if (body?.state !== undefined) updateData.state = body.state;
    if (body?.address !== undefined) updateData.address = body.address;
    if (body?.metaPixelId !== undefined) updateData.metaPixelId = body.metaPixelId;
    if (body?.googleAdsId !== undefined) updateData.googleAdsId = body.googleAdsId;

    const updatedStore = await prisma.store.update({
      where: { id: store.id },
      data: updateData,
    });

    return NextResponse.json({ store: updatedStore });
  } catch (error) {
    console.error("Update store error:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar loja" },
      { status: 500 }
    );
  }
}
