import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PublicCatalog } from "./_components/public-catalog";
import type { ColorOption } from "@/lib/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = params?.slug;

  if (!slug || slug === 'api' || slug === 'dashboard' || slug === 'login' || slug === 'register' || slug === 'onboarding') {
    return {};
  }

  const store = await prisma.store.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
      logoUrl: true,
      bannerUrl: true,
    },
  });

  if (!store) {
    return {};
  }

  const title = `${store.name} - Catálogo`;
  const description = store.description || `Confira o catálogo completo de ${store.name}`;

  return {
    title,
    description,
    icons: {
      icon: store.logoUrl || '/favicon.svg',
      apple: store.logoUrl || '/favicon.svg',
    },
    openGraph: {
      title,
      description,
      images: store.bannerUrl ? [store.bannerUrl] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: store.bannerUrl ? [store.bannerUrl] : [],
    },
  };
}

export default async function PublicStorePage({ params }: PageProps) {
  const slug = params?.slug;

  if (!slug || slug === 'api' || slug === 'dashboard' || slug === 'login' || slug === 'register' || slug === 'onboarding') {
    notFound();
  }

  const store = await prisma.store.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        orderBy: [
          { displayOrder: "asc" },
          { createdAt: "desc" },
        ],
      },
    },
  });



  if (!store) {
    notFound();
  }

  // Se a loja está suspensa, retornar 404 para o público
  if (store.isSuspended) {
    notFound();
  }

  const serializedStore = {
    ...store,
    products: store.products?.map?.((p) => ({
      ...p,
      basePrice: p.basePrice ? Number(p.basePrice) : null,
      discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
      availableColors: (p.availableColors as ColorOption[] | null) ?? [],
      galleryUrls: p.galleryUrls,
    })) ?? [],
  };

  return <PublicCatalog store={serializedStore as any} />;
}
