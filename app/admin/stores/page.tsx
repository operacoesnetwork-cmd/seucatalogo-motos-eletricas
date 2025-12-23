"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Store,
  ChevronLeft,
  ChevronRight,
  Eye,
  Ban,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface StoreData {
  id: string;
  name: string;
  slug: string;
  whatsapp: string;
  isActive: boolean;
  isSuspended: boolean;
  suspendedReason: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  _count: {
    products: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminStoresPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [stores, setStores] = useState<StoreData[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchStores = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (search) params.set("search", search);
      if (status !== "all") params.set("status", status);

      const res = await fetch(`/api/admin/stores?${params}`);
      if (res.ok) {
        const data = await res.json();
        setStores(data.stores);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Erro ao buscar lojas:", error);
      toast.error("Erro ao carregar lojas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStores(1);
  };

  const handleSuspend = async (storeId: string) => {
    const reason = prompt("Motivo da suspensão:");
    if (reason === null) return;

    setActionLoading(storeId);
    try {
      const res = await fetch(`/api/admin/stores/${storeId}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      if (res.ok) {
        toast.success("Loja suspensa com sucesso");
        fetchStores(pagination.page);
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao suspender loja");
      }
    } catch (error) {
      toast.error("Erro ao suspender loja");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivate = async (storeId: string) => {
    if (!confirm("Tem certeza que deseja reativar esta loja?")) return;

    setActionLoading(storeId);
    try {
      const res = await fetch(`/api/admin/stores/${storeId}/reactivate`, {
        method: "POST",
      });

      if (res.ok) {
        toast.success("Loja reativada com sucesso");
        fetchStores(pagination.page);
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao reativar loja");
      }
    } catch (error) {
      toast.error("Erro ao reativar loja");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lojas</h1>
        <p className="mt-1 text-gray-500">
          Gerencie todas as lojas da plataforma
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nome, slug ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-80 pl-10"
            />
          </div>
          <Button type="submit">Buscar</Button>
        </form>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 w-40 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">Todos</option>
          <option value="active">Ativas</option>
          <option value="suspended">Suspensas</option>
        </select>
      </div>

      {/* Tabela */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Loja
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Proprietário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Produtos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Criada em
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
                    </div>
                  </td>
                </tr>
              ) : stores.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Nenhuma loja encontrada
                  </td>
                </tr>
              ) : (
                stores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                          <Store className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{store.name}</p>
                          <p className="text-sm text-gray-500">/{store.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{store.user.name || "-"}</p>
                      <p className="text-sm text-gray-500">{store.user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">{store._count.products}</span>
                    </td>
                    <td className="px-6 py-4">
                      {store.isSuspended ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          <Ban className="h-3 w-3" />
                          Suspensa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          <CheckCircle className="h-3 w-3" />
                          Ativa
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(store.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/${store.slug}`}
                          target="_blank"
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          title="Ver catálogo"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/stores/${store.id}`}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {store.isSuspended ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-green-600 hover:bg-green-50 hover:text-green-700"
                            onClick={() => handleReactivate(store.id)}
                            disabled={actionLoading === store.id}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Reativar
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleSuspend(store.id)}
                            disabled={actionLoading === store.id}
                          >
                            <Ban className="h-4 w-4" />
                            Suspender
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            <p className="text-sm text-gray-500">
              Mostrando {(pagination.page - 1) * pagination.limit + 1} -{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} de{" "}
              {pagination.total} lojas
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchStores(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchStores(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
