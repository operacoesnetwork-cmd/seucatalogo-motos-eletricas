import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // Proteger rotas /admin/*
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // Verificar se está autenticado
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Verificar se é super-admin
    if (token.role !== "SUPER_ADMIN") {
      // Redireciona para dashboard se não for admin
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
  
  // Proteger APIs /api/admin/*
  if (req.nextUrl.pathname.startsWith("/api/admin")) {
    if (!token) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    
    if (token.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Acesso negado. Requer permissão de administrador." },
        { status: 403 }
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*"
  ]
};
