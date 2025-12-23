"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Store,
  User,
  Package,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Ban,
  CheckCircle,
  AlertTriangle,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface StoreDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  whatsapp: string;
  instagram: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  primaryColor: string;
  isActive: boolean;
  isSuspended: boolean;
  suspendedReason: string | null;
  suspendedAt: string | null;
  maxProducts: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
  };
  products: {
    id: string;
    name: string;
    category: string;
    isActive: boolean;
    mainImageUrl: string;
    basePrice: number | null;
    createdAt: string;
  }[];
}

export default function AdminStoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [store, setStore] = useState<StoreDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStore = async () => {
    try {
      const res = await fetch(`/api/admin/stores/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setStore(data);
      } else {
        toast.error("Loja não encontrada");
        router.push("/admin/stores");
      }
    } catch (error) {
      console.error("Erro ao buscar loja:", error);
      toast.error("Erro ao carregar loja");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStore();
  }, [params.id]);

  const handleSuspend = async () => {
    const reason = prompt("Motivo da suspensão:");
    if (reason === null) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/stores/${params.id}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      if (res.ok) {
        toast.success("Loja suspensa com sucesso");
        fetchStore();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao suspender loja");
      }
    } catch (error) {
      toast.error("Erro ao suspender loja");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    if (!confirm("Tem certeza que deseja reativar esta loja?")) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/stores/${params.id}/reactivate`, {
        method: "POST",
      });

      if (res.ok) {
        toast.success("Loja reativada com sucesso");
        fetchStore();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao reativar loja");
      }
    } catch (error) {
      toast.error("Erro ao reativar loja");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateLimit = async () => {
    const newLimit = prompt(
      `Limite atual: ${store?.maxProducts || 20} produtos\n\nDigite o novo limite:`,
      String(store?.maxProducts || 20)
    );
    
    if (newLimit === null) return;
    
    const limitNumber = parseInt(newLimit);
    if (isNaN(limitNumber) || limitNumber < 1) {
      toast.error("Limite deve ser um número maior que 0");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/stores/${params.id}/limit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxProducts: limitNumber }),
      });

      if (res.ok) {
        toast.success("Limite atualizado com sucesso");
        fetchStore();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao atualizar limite");
      }
    } catch (error) {
      toast.error("Erro ao atualizar limite");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!store) {
    return null;
  }

  const activeProducts = store.products.filter((p) => p.isActive).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/stores"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para lojas
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {store.logoUrl ? (
              <img
                src={store.logoUrl}
                alt={store.name}
                className="h-16 w-16 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-orange-100">
                <Store className="h-8 w-8 text-orange-600" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
              <p className="text-gray-500">/{store.slug}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/${store.slug}`} target="_blank">
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Ver Catálogo
              </Button>
            </Link>
            {store.isSuspended ? (
              <Button
                className="gap-2 bg-green-600 hover:bg-green-700"
                onClick={handleReactivate}
                disabled={actionLoading}
              >
                <CheckCircle className="h-4 w-4" />
                Reativar Loja
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="gap-2"
                onClick={handleSuspend}
                disabled={actionLoading}
              >
                <Ban className="h-4 w-4" />
                Suspender Loja
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Status de Suspensão */}
      {store.isSuspended && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Loja Suspensa</h3>
              <p className="mt-1 text-sm text-red-700">
                Motivo: {store.suspendedReason || "Não informado"}
              </p>
              {store.suspendedAt && (
                <p className="mt-1 text-sm text-red-600">
                  Suspensa em:{" "}
                  {new Date(store.suspendedAt).toLocaleString("pt-BR")}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Informações da Loja */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Informações da Loja</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">WhatsApp</p>
                  <p className="font-medium text-gray-900">{store.whatsapp}</p>
                </div>
              </div>
              {store.instagram && (
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">@</span>
                  <div>
                    <p className="text-sm text-gray-500">Instagram</p>
                    <p className="font-medium text-gray-900">{store.instagram}</p>
                  </div>
                </div>
              )}
              {(store.city || store.state) && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Localização</p>
                    <p className="font-medium text-gray-900">
                      {store.city}{store.city && store.state && ", "}{store.state}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Criada em</p>
                  <p className="font-medium text-gray-900">
                    {new Date(store.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>
            {store.description && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500">Descrição</p>
                <p className="mt-1 text-gray-700">{store.description}</p>
              </div>
            )}
          </div>

          {/* Produtos */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Produtos</h2>
              <span className="text-sm text-gray-500">
                {activeProducts} ativos / {store.products.length} total
              </span>
            </div>
            {store.products.length === 0 ? (
              <p className="py-8 text-center text-gray-500">Nenhum produto cadastrado</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {store.products.slice(0, 6).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 p-3"
                  >
                    <img
                      src={product.mainImageUrl}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    {!product.isActive && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        Inativo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            {store.products.length > 6 && (
              <p className="mt-4 text-center text-sm text-gray-500">
                + {store.products.length - 6} outros produtos
              </p>
            )}
          </div>
        </div>

        {/* Sidebar - Proprietário e Status */}
        <div className="space-y-6">
          {/* Proprietário */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Proprietário</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {store.user.name || "Sem nome"}
                  </p>
                  <p className="text-sm text-gray-500">{store.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <a
                  href={`mailto:${store.user.email}`}
                  className="text-sm text-orange-600 hover:underline"
                >
                  Enviar email
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Usuário desde</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(store.user.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Estatísticas</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Total de produtos</span>
                <span className="font-semibold text-gray-900">{store.products.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Produtos ativos</span>
                <span className="font-semibold text-gray-900">{activeProducts}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-gray-500">Limite de produtos</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{store.maxProducts || 20}</span>
                  <button
                    onClick={handleUpdateLimit}
                    disabled={actionLoading}
                    className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
                    title="Editar limite"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
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
              </div>
            </div>
          </div>

          {/* Cor primária */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Personalização</h2>
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-lg border border-gray-200"
                style={{ backgroundColor: store.primaryColor }}
              />
              <div>
                <p className="text-sm text-gray-500">Cor primária</p>
                <p className="font-mono text-sm text-gray-900">{store.primaryColor}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
