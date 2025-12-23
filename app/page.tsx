import Link from "next/link";
import { Zap, Smartphone, MessageCircle, Palette, ArrowRight, CheckCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">EletroMoto</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
            >
              Criar Catálogo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
          <Zap className="h-4 w-4" />
          Catálogo Digital para Motos Elétricas
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Seu catálogo de motos elétricas em um <span className="text-green-500">único link</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Crie um catálogo digital profissional para sua loja de motos elétricas.
          Compartilhe com clientes via WhatsApp e redes sociais.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 text-lg font-medium text-white bg-green-500 rounded-xl hover:bg-green-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            Criar Meu Catálogo Grátis
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/demo-store"
            className="w-full sm:w-auto px-8 py-4 text-lg font-medium text-green-600 bg-green-50 rounded-xl hover:bg-green-100 transition-all flex items-center justify-center gap-2"
          >
            Ver Exemplo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Tudo que você precisa para vender mais
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <Smartphone className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Mobile-First</h3>
            <p className="text-gray-600">
              Catálogo otimizado para celular. Seus clientes acessam de qualquer lugar.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <MessageCircle className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">WhatsApp Integrado</h3>
            <p className="text-gray-600">
              Botão de contato direto em cada produto. Receba pedidos no seu WhatsApp.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <Palette className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Sua Identidade Visual</h3>
            <p className="text-gray-600">
              Personalize cores, logo e banner. Deixe o catálogo com a cara da sua loja.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Por que usar o EletroMoto Catálogo?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Link único para compartilhar todo seu catálogo",
              "Cadastro de especificações técnicas completas",
              "Galeria de fotos para cada veículo",
              "Preços visíveis ou sob consulta",
              "FAQ automático sobre motos elétricas",
              "Atualizações em tempo real",
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-4 bg-gray-800 p-4 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                <span className="text-gray-200">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Comece agora mesmo
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Crie sua conta gratuita e tenha seu catálogo digital pronto em minutos.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium text-white bg-green-500 rounded-xl hover:bg-green-600 transition-all shadow-lg hover:shadow-xl"
        >
          Criar Meu Catálogo
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">EletroMoto Catálogo</span>
          </div>
          <p className="text-sm text-gray-500">
            Catálogo digital para lojas de motos elétricas
          </p>
        </div>
      </footer>
    </div>
  );
}
