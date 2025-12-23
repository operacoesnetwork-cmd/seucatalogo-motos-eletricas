"use client";

import { useEffect, useState } from "react";
import { Store, Users, Package, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { StatsCard } from "../_components/stats-card";

interface Stats {
  totalStores: number;
  activeStores: number;
  suspendedStores: number;
  totalUsers: number;
  totalProducts: number;
  activeProducts: number;
  newStoresThisMonth: number;
  storesTrend: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-500">
          Visão geral da plataforma
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Lojas"
          value={stats?.totalStores || 0}
          icon={Store}
          trend={
            stats?.storesTrend !== undefined
              ? { value: stats.storesTrend, isPositive: stats.storesTrend >= 0 }
              : undefined
          }
        />
        <StatsCard
          title="Lojas Ativas"
          value={stats?.activeStores || 0}
          icon={CheckCircle}
          description={`${stats?.suspendedStores || 0} suspensas`}
        />
        <StatsCard
          title="Usuários"
          value={stats?.totalUsers || 0}
          icon={Users}
        />
        <StatsCard
          title="Produtos"
          value={stats?.totalProducts || 0}
          icon={Package}
          description={`${stats?.activeProducts || 0} ativos`}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Card de resumo */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Resumo do Mês</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-gray-600">Novas lojas este mês</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {stats?.newStoresThisMonth || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-orange-100 p-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-gray-600">Lojas suspensas</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {stats?.suspendedStores || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Card de ações rápidas */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Ações Rápidas</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href="/admin/stores"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-orange-500 hover:bg-orange-50"
            >
              <Store className="h-5 w-5 text-orange-600" />
              <span className="font-medium text-gray-700">Ver todas as lojas</span>
            </a>
            <a
              href="/admin/stores?status=suspended"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-orange-500 hover:bg-orange-50"
            >
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span className="font-medium text-gray-700">Lojas suspensas</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
