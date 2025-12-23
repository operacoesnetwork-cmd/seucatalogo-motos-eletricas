"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Store,
  LogOut,
  Shield,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Lojas",
    href: "/admin/stores",
    icon: Store,
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-gray-900">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-gray-700 px-6">
          <Shield className="h-8 w-8 text-orange-500" />
          <div>
            <span className="text-lg font-bold text-white">Super Admin</span>
            <p className="text-xs text-gray-400">Painel Administrativo</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4 space-y-2">
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar ao Dashboard
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-gray-400 hover:bg-gray-800 hover:text-red-400"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </aside>
  );
}
