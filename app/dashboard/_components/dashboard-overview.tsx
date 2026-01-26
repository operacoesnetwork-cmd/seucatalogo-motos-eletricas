"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import {
  Package,
  Eye,
  Palette,
  Settings,
  Plus,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StoreData {
  id: string;
  name: string;
  slug: string;
  products: any[];
  logoUrl: string | null;
  bannerUrl: string | null;
  maxProducts: number;
}

export function DashboardOverview() {
  const { data: session } = useSession() || {};
  const [store, setStore] = React.useState<StoreData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await fetch("/api/stores");
        const data = await response?.json?.();
        setStore(data?.store ?? null);
      } catch (error) {
        console.error("Error fetching store:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStore();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading size="lg" text="Carregando..." />
      </div>
    );
  }

  const productCount = store?.products?.length ?? 0;
  const activeProducts = store?.products?.filter?.((p) => p?.isActive)?.length ?? 0;
  const hasLogo = !!store?.logoUrl;
  const hasBanner = !!store?.bannerUrl;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Olá, {session?.user?.name?.split(" ")[0] ?? "Usuário"}!
          </h1>
          <p className="text-gray-500">Gerencie seu catálogo digital</p>
        </div>
        {store?.slug && (
          <Link href={`/${store.slug}`} target="_blank">
            <Button variant="soft">
              <ExternalLink className="h-4 w-4" />
              Ver Catálogo Online
            </Button>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {productCount}
                  <span className="text-sm text-gray-400 font-normal ml-1">
                    / {store?.maxProducts || 20}
                  </span>
                </p>
                <p className="text-sm font-medium text-gray-500">Produtos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
                <p className="text-sm font-medium text-gray-500">Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  hasLogo ? "bg-purple-50" : "bg-gray-100"
                )}
              >
                <Palette
                  className={cn(
                    "h-6 w-6 transition-colors",
                    hasLogo ? "text-purple-600" : "text-gray-400"
                  )}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Logo</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      hasLogo ? "bg-purple-500" : "bg-gray-300"
                    )}
                  />
                  <p className="text-xs text-gray-500">
                    {hasLogo ? "Configurado" : "Pendente"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  hasBanner ? "bg-blue-50" : "bg-gray-100"
                )}
              >
                <Settings
                  className={cn(
                    "h-6 w-6 transition-colors",
                    hasBanner ? "text-blue-600" : "text-gray-400"
                  )}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Banner</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      hasBanner ? "bg-blue-500" : "bg-gray-300"
                    )}
                  />
                  <p className="text-xs text-gray-500">
                    {hasBanner ? "Configurado" : "Pendente"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        Ações Rápidas
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-xl border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer hover:border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 group-hover:text-primary transition-colors">
              <Package className="h-5 w-5 text-primary" />
              Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-6 text-sm">
              Adicione e gerencie os veículos do seu catálogo.
            </p>
            <div className="flex gap-3">
              <Link href="/dashboard/products/new">
                <Button className="shadow-sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Novo Produto
                </Button>
              </Link>
              <Link href="/dashboard/products">
                <Button variant="outline">
                  Ver Todos
                  <ArrowRight className="h-4 w-4 ml-1 opacity-70" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer hover:border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 group-hover:text-purple-600 transition-colors">
              <Palette className="h-5 w-5 text-purple-600" />
              Identidade Visual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-6 text-sm">
              Personalize as cores, logo e banner do seu catálogo.
            </p>
            <Link href="/dashboard/identity">
              <Button variant="outline" className="hover:text-purple-600 hover:bg-purple-50 hover:border-purple-200">
                Personalizar
                <ArrowRight className="h-4 w-4 ml-1 opacity-70" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      {productCount > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Produtos Recentes</h2>
          <Card className="rounded-xl border-gray-100 shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {store?.products?.slice?.(0, 5)?.map?.((product) => (
                  <div
                    key={product?.id ?? ""}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50/80 transition-colors group"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200 flex-shrink-0">
                      {product?.mainImageUrl ? (
                        <img
                          src={product.mainImageUrl}
                          alt={product?.name ?? ""}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full text-gray-400">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate text-base group-hover:text-primary transition-colors">
                        {product?.name ?? "Sem nome"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                            product?.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-gray-50 text-gray-600 border-gray-200"
                          )}
                        >
                          {product?.isActive ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/dashboard/products/${product?.id ?? ""}`}>
                        <Button variant="ghost" size="sm" className="h-8">
                          Editar
                        </Button>
                      </Link>
                      <Link
                        href={`/${store?.slug}/${product?.slug}`}
                        target="_blank"
                      >
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-primary">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )) ?? []}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
