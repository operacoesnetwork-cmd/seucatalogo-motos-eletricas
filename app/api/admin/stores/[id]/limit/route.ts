import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { maxProducts } = await req.json();

    if (!maxProducts || maxProducts < 1) {
      return NextResponse.json(
        { error: "Limite deve ser no mínimo 1" },
        { status: 400 }
      );
    }

    const store = await prisma.store.findUnique({
      where: { id: params.id },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Loja não encontrada" },
        { status: 404 }
      );
    }

    const updatedStore = await prisma.store.update({
      where: { id: params.id },
      data: {
        maxProducts: parseInt(maxProducts),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Limite de produtos atualizado com sucesso",
      store: updatedStore,
    });
  } catch (error) {
    console.error("Erro ao atualizar limite de produtos:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar limite de produtos" },
      { status: 500 }
    );
  }
}
