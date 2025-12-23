"use client";

import * as React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageLoading } from "@/components/ui/loading";
import {
  Zap,
  LayoutDashboard,
  Palette,
  Settings,
  Package,
  ExternalLink,
  LogOut,
  Menu,
  X,
  AlertTriangle,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/dashboard/identity", label: "Identidade Visual", icon: Palette },
  { href: "/dashboard/settings", label: "Configurações", icon: Settings },
  { href: "/dashboard/products", label: "Produtos", icon: Package },
];

interface StoreStatus {
  id: string;
  name: string;
  slug: string;
  isSuspended: boolean;
  suspendedReason: string | null;
  suspendedAt: Date | null;
  suspensionType: string | null;
}

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [storeStatus, setStoreStatus] = React.useState<StoreStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = React.useState(true);

  // Buscar status da loja
  React.useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.hasStore) {
      fetch("/api/store/status")
        .then((res) => res.json())
        .then((data) => {
          if (data.store) {
            setStoreStatus(data.store);
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar status da loja:", error);
        })
        .finally(() => {
          setLoadingStatus(false);
        });
    }
  }, [status, session]);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
    if (status === "authenticated" && !(session?.user as any)?.hasStore) {
      router.replace("/onboarding");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <PageLoading />;
  }

  if (status === "unauthenticated" || !(session?.user as any)?.hasStore) {
    return <PageLoading />;
  }

  const storeSlug = (session?.user as any)?.storeSlug ?? '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">EletroMoto</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-gray-900">EletroMoto</span>
                <p className="text-xs text-gray-500">Catálogo Digital</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems?.map?.((item) => {
              const Icon = item?.icon ?? LayoutDashboard;
              const isActive = pathname === item?.href;
              return (
                <Link
                  key={item?.href ?? ''}
                  href={item?.href ?? ''}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item?.label ?? ''}
                </Link>
              );
            }) ?? []}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            {storeSlug && (
              <Link
                href={`/${storeSlug}`}
                target="_blank"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50 transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
                Ver Meu Catálogo
              </Link>
            )}
            <button
              onClick={() => signOut?.({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors w-full"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Banner de Suspensão */}
        {storeStatus?.isSuspended && (
          <div className={cn(
            "border-l-4 p-4 m-4 lg:m-8 mb-0",
            storeStatus.suspensionType === "pending_activation" 
              ? "bg-blue-50 border-blue-500" 
              : "bg-red-50 border-red-500"
          )}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={cn(
                "h-6 w-6 flex-shrink-0 mt-0.5",
                storeStatus.suspensionType === "pending_activation"
                  ? "text-blue-600"
                  : "text-red-600"
              )} />
              <div className="flex-1">
                {storeStatus.suspensionType === "pending_activation" ? (
                  <>
                    <h3 className="text-blue-800 font-semibold text-lg mb-1">
                      🎉 Bem-vindo ao seu Catálogo Digital!
                    </h3>
                    <p className="text-blue-700 mb-2">
                      Sua conta foi criada com sucesso! Para ativar seu catálogo e começar a vender, entre em contato com nosso suporte.
                    </p>
                    <p className="text-blue-600 text-sm">
                      Enquanto isso, você pode configurar sua loja, adicionar produtos e personalizar a identidade visual.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-red-800 font-semibold text-lg mb-1">
                      Catálogo Suspenso
                    </h3>
                    <p className="text-red-700 mb-2">
                      Sua assinatura está desativada. Entre em contato com o suporte para reativar.
                    </p>
                    {storeStatus.suspendedReason && (
                      <p className="text-red-600 text-sm">
                        <strong>Motivo:</strong> {storeStatus.suspendedReason}
                      </p>
                    )}
                    <p className="text-red-600 text-sm mt-2">
                      Seu catálogo está indisponível para visualização dos clientes, mas você ainda pode gerenciar produtos e configurações.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
