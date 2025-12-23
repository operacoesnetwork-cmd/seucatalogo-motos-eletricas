import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const store = await prisma.store.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
          },
        },
        products: {
          select: {
            id: true,
            name: true,
            category: true,
            isActive: true,
            mainImageUrl: true,
            basePrice: true,
            createdAt: true,
          },
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Loja não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error("Erro ao buscar loja:", error);
    return NextResponse.json(
      { error: "Erro ao buscar loja" },
      { status: 500 }
    );
  }
}
