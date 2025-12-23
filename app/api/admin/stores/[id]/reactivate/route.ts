import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const store = await prisma.store.findUnique({
      where: { id: params.id },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Loja não encontrada" },
        { status: 404 }
      );
    }

    if (!store.isSuspended) {
      return NextResponse.json(
        { error: "Loja não está suspensa" },
        { status: 400 }
      );
    }

    const updatedStore = await prisma.store.update({
      where: { id: params.id },
      data: {
        isSuspended: false,
        suspendedReason: null,
        suspendedAt: null,
        suspensionType: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Loja reativada com sucesso",
      store: updatedStore,
    });
  } catch (error) {
    console.error("Erro ao reativar loja:", error);
    return NextResponse.json(
      { error: "Erro ao reativar loja" },
      { status: 500 }
    );
  }
}
