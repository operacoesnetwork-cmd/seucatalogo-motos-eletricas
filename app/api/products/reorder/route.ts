export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

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
    const { productIds } = body;

    if (!Array.isArray(productIds)) {
      return NextResponse.json(
        { error: "productIds deve ser um array" },
        { status: 400 }
      );
    }

    const store = await prisma.store.findUnique({
      where: { userId },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Loja não encontrada" },
        { status: 404 }
      );
    }

    // Update display order for each product
    const updatePromises = productIds.map((productId, index) =>
      prisma.product.updateMany({
        where: {
          id: productId,
          storeId: store.id, // Ensure user owns the product
        },
        data: {
          displayOrder: index,
        },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder products error:", error);
    return NextResponse.json(
      { error: "Erro ao reordenar produtos" },
      { status: 500 }
    );
  }
}
