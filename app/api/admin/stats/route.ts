import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Contar lojas
    const totalStores = await prisma.store.count();
    const activeStores = await prisma.store.count({
      where: { isActive: true, isSuspended: false },
    });
    const suspendedStores = await prisma.store.count({
      where: { isSuspended: true },
    });

    // Contar usuários
    const totalUsers = await prisma.user.count();

    // Contar produtos
    const totalProducts = await prisma.product.count();
    const activeProducts = await prisma.product.count({
      where: { isActive: true },
    });

    // Lojas criadas este mês
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newStoresThisMonth = await prisma.store.count({
      where: {
        createdAt: { gte: startOfMonth },
      },
    });

    // Lojas criadas mês passado (para calcular trend)
    const startOfLastMonth = new Date(startOfMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    const endOfLastMonth = new Date(startOfMonth);
    endOfLastMonth.setMilliseconds(-1);

    const newStoresLastMonth = await prisma.store.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    // Calcular trend
    let storesTrend = 0;
    if (newStoresLastMonth > 0) {
      storesTrend = Math.round(
        ((newStoresThisMonth - newStoresLastMonth) / newStoresLastMonth) * 100
      );
    }

    return NextResponse.json({
      totalStores,
      activeStores,
      suspendedStores,
      totalUsers,
      totalProducts,
      activeProducts,
      newStoresThisMonth,
      storesTrend,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}
