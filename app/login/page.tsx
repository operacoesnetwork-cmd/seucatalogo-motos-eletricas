import { LoginForm } from "./_components/login-form";
import Link from "next/link";
import Image from "next/image";
import { CircularGallery } from "@/components/ui/circular-gallery";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* Background Gallery */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen scale-110">
        <CircularGallery
          bend={2}
          className="text-white"
          borderRadius={0.05}
          scrollSpeed={0.3}
          items={[
            { image: "https://wsrv.nl/?url=img.ntec.network/produtos/capa/ebr_1000.jpg", text: "EBR 1000" },
            { image: "https://wsrv.nl/?url=img.ntec.network/produtos/capa/duact_maxus.jpg", text: "DUACT MAXUS" },
            { image: "https://wsrv.nl/?url=img.ntec.network/produtos/capa/tokyo.jpg", text: "TOKYO" },
            { image: "https://wsrv.nl/?url=img.ntec.network/produtos/capa/jet.jpg", text: "JET" },
            { image: "https://wsrv.nl/?url=img.ntec.network/produtos/capa/x12.jpg", text: "X12" },
            { image: "https://wsrv.nl/?url=img.ntec.network/produtos/capa/u3_wanshida.jpg", text: "U3 WANSHIDA" },
          ]}
        />
      </div>

      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/20 pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10 px-6">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Voltar para o site
        </Link>

        {/* Glass Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
          {/* Inner Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none" />

          <div className="relative z-10">
            {/* Logo & Header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/10 shadow-lg glow-primary">
                <Image src="/brand/icon.svg" alt="Logo" width={32} height={32} className="object-contain drop-shadow-lg" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Bem-vindo(a)</h1>
              <p className="text-gray-400 text-sm md:text-base">Entre para gerenciar seu catálogo digital</p>
            </div>

            <LoginForm />

            <div className="mt-8 text-center pt-6 border-t border-white/5">
              <p className="text-sm text-gray-500">
                Não tem uma conta?{" "}
                <Link href="/register" className="text-primary hover:text-primary-300 font-medium transition-colors hover:underline underline-offset-4">
                  Criar conta gratuitamente
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
