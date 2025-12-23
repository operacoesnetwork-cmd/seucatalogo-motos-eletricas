import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { reason } = await req.json();

    const store = await prisma.store.findUnique({
      where: { id: params.id },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Loja não encontrada" },
        { status: 404 }
      );
    }

    if (store.isSuspended) {
      return NextResponse.json(
        { error: "Loja já está suspensa" },
        { status: 400 }
      );
    }

    const updatedStore = await prisma.store.update({
      where: { id: params.id },
      data: {
        isSuspended: true,
        suspendedReason: reason || "Suspensão administrativa",
        suspendedAt: new Date(),
        suspensionType: "admin_suspended",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Loja suspensa com sucesso",
      store: updatedStore,
    });
  } catch (error) {
    console.error("Erro ao suspender loja:", error);
    return NextResponse.json(
      { error: "Erro ao suspender loja" },
      { status: 500 }
    );
  }
}
