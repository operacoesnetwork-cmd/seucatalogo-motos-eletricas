"use client";

import * as React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PageLoading } from "@/components/ui/loading";
import {
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
import { ShareButton } from "@/components/ui/share-button";

const navItems = [
  { href: "/dashboard", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/dashboard/identity", label: "Aparência", icon: Palette },
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
    return <PageLoading />; // Ensure PageLoading is compatible with dark mode or is neutral
  }

  if (status === "unauthenticated" || !(session?.user as any)?.hasStore) {
    return <PageLoading />;
  }

  const storeSlug = (session?.user as any)?.storeSlug ?? '';

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm h-[60px]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 relative flex items-center justify-center bg-primary/10 rounded-lg">
            <Image src="/brand/icon.svg" alt="Logo" fill className="object-contain p-1.5" />
          </div>
          <span className="font-bold text-gray-900 tracking-tight">EletroMoto</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 p-2 pr-1 rounded-lg text-primary hover:bg-primary/5 transition-colors"
        >
          <span className="text-sm font-semibold uppercase tracking-wide">Menu</span>
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex-shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full relative">
          {/* Logo Area */}
          <div className="p-6 border-b border-gray-100 hidden lg:block">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 relative flex items-center justify-center bg-primary/10 rounded-xl group-hover:scale-105 transition-transform">
                <Image src="/brand/icon.svg" alt="Logo" fill className="object-contain p-2" />
              </div>
              <div>
                <span className="font-bold text-lg text-gray-900 tracking-tight group-hover:text-primary transition-colors">EletroMoto</span>
                <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Dashboard</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar pt-[80px] lg:pt-6">
            <div className="px-3 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Menu Principal</div>
            {navItems?.map?.((item) => {
              const Icon = item?.icon ?? LayoutDashboard;
              const isActive = pathname === item?.href;
              return (
                <Link
                  key={item?.href ?? ''}
                  href={item?.href ?? ''}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn("h-5 w-5 transition-transform", isActive && "text-primary")} />
                  {item?.label ?? ''}
                </Link>
              );
            }) ?? []}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-3">
            <div className="px-1 mb-1">
              <p className="text-xs text-gray-500 font-medium truncate">Loja: <span className="text-gray-900 font-semibold">{storeSlug}</span></p>
            </div>
            {storeSlug && (
              <Link
                href={`/${storeSlug}`}
                target="_blank"
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-transparent transition-all"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Ver Minha Loja
              </Link>
            )}
            {storeSlug && (
              <ShareButton
                url={`${typeof window !== 'undefined' ? window.location.origin : ''}/${storeSlug}`}
                title={storeStatus?.name ?? "Minha Loja"}
                text={`Confira o catálogo da ${storeStatus?.name ?? "loja"}`}
                variant="outline"
                size="sm"
                className="w-full text-xs font-medium border-gray-200 hover:bg-white hover:text-primary transition-colors"
              >
                Compartilhar Link
              </ShareButton>
            )}
            <button
              onClick={() => signOut?.({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors w-full justify-center"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair da conta
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full min-w-0 flex flex-col h-full bg-gray-50 overflow-hidden pt-[60px] lg:pt-0">

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          {/* Banner de Suspensão */}
          {storeStatus?.isSuspended && (
            <div className={cn(
              "border-l-4 p-4 mb-6 rounded-r-lg shadow-sm border",
              storeStatus.suspensionType === "pending_activation"
                ? "bg-blue-50 border-l-blue-500 border-blue-100"
                : "bg-red-50 border-l-red-500 border-red-100"
            )}>
              <div className="flex items-start gap-3">
                <AlertTriangle className={cn(
                  "h-5 w-5 flex-shrink-0 mt-0.5",
                  storeStatus.suspensionType === "pending_activation"
                    ? "text-blue-600"
                    : "text-red-600"
                )} />
                <div className="flex-1">
                  {storeStatus.suspensionType === "pending_activation" ? (
                    <>
                      <h3 className="text-blue-800 font-semibold text-base mb-1">
                        🎉 Bem-vindo ao seu Catálogo Digital!
                      </h3>
                      <p className="text-blue-700 text-sm mb-2 leading-relaxed">
                        Sua conta foi criada com sucesso! Para ativar seu catálogo e começar a vender, entre em contato com nosso suporte.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-red-800 font-semibold text-base mb-1">
                        Catálogo Suspenso
                      </h3>
                      <p className="text-red-700 text-sm mb-2 leading-relaxed">
                        Sua assinatura está desativada. Entre em contato com o suporte para reativar.
                      </p>
                      {storeStatus.suspendedReason && (
                        <p className="text-red-600 text-sm mt-1">
                          <strong>Motivo:</strong> {storeStatus.suspendedReason}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="max-w-6xl mx-auto pb-10">{children}</div>
        </div>
      </main>
    </div>
  );
}
