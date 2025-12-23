import { LoginForm } from "./_components/login-form";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <header className="p-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">EletroMoto</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo de volta</h1>
              <p className="text-gray-600">Entre na sua conta para gerenciar seu catálogo</p>
            </div>
            <LoginForm />
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{" "}
                <Link href="/register" className="text-green-600 font-medium hover:text-green-700">
                  Criar conta
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
