import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            isSuspended: true,
            suspendedReason: true,
            suspendedAt: true,
            suspensionType: true,
          },
        },
      },
    });

    if (!user?.store) {
      return NextResponse.json(
        { error: "Loja não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      store: user.store,
    });
  } catch (error) {
    console.error("Erro ao buscar status da loja:", error);
    return NextResponse.json(
      { error: "Erro ao buscar status da loja" },
      { status: 500 }
    );
  }
}
