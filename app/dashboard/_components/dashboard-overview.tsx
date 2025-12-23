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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Olá, {session?.user?.name ?? 'Usuário'}!
          </h1>
          <p className="text-gray-600">Gerencie seu catálogo digital</p>
        </div>
        {store?.slug && (
          <Link href={`/${store.slug}`} target="_blank">
            <Button variant="outline">
              <ExternalLink className="h-4 w-4" />
              Ver Catálogo
            </Button>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {productCount}
                  <span className="text-sm text-gray-400 font-normal"> / {store?.maxProducts || 20}</span>
                </p>
                <p className="text-sm text-gray-500">Produtos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
                <p className="text-sm text-gray-500">Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${hasLogo ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Palette className={`h-6 w-6 ${hasLogo ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Logo</p>
                <p className="text-sm text-gray-500">{hasLogo ? 'Configurado' : 'Pendente'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${hasBanner ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Settings className={`h-6 w-6 ${hasBanner ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Banner</p>
                <p className="text-sm text-gray-500">{hasBanner ? 'Configurado' : 'Pendente'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Adicione e gerencie os veículos do seu catálogo.
            </p>
            <div className="flex gap-3">
              <Link href="/dashboard/products/new">
                <Button>
                  <Plus className="h-4 w-4" />
                  Novo Produto
                </Button>
              </Link>
              <Link href="/dashboard/products">
                <Button variant="outline">
                  Ver Todos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-green-600" />
              Identidade Visual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Personalize as cores, logo e banner do seu catálogo.
            </p>
            <Link href="/dashboard/identity">
              <Button variant="outline">
                Personalizar
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      {productCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Produtos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {store?.products?.slice?.(0, 5)?.map?.((product) => (
                <div
                  key={product?.id ?? ''}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden relative">
                    {product?.mainImageUrl && (
                      <img
                        src={product.mainImageUrl}
                        alt={product?.name ?? ''}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {product?.name ?? 'Sem nome'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product?.isActive ? 'Ativo' : 'Inativo'}
                    </p>
                  </div>
                  <Link href={`/dashboard/products/${product?.id ?? ''}`}>
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </Link>
                </div>
              )) ?? []}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
