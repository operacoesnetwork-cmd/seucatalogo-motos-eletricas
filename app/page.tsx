"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Zap, Smartphone, MessageCircle, Palette, ArrowRight, CheckCircle, Sparkles, Rocket, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CircularGallery } from "@/components/ui/circular-gallery";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white selection:bg-primary/20 selection:text-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative flex items-center justify-center bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
              <Image src="/brand/icon.svg" alt="Logo" fill className="object-contain p-2" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">EletroMoto</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              Entrar
            </Link>
            <Link href="/register">
              <Button className="rounded-full px-6 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105">
                Criar Catálogo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-[100vh] overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-200/20 blur-[120px]" />
        </div>

        {/* Hero Section */}
        <section className="relative w-full overflow-hidden">
          {/* Circular Gallery Background */}
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none md:pointer-events-auto">
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
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white/0 md:via-white/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </div>

          <div className="relative z-10 px-6 pt-20 pb-32 md:pt-32 md:pb-48 max-w-7xl mx-auto text-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-semibold mb-8 hover:bg-primary/10 transition-colors cursor-default backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                <span>O novo padrão para lojas de motos elétricas</span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-gray-900 mb-8 max-w-5xl mx-auto leading-[1.1] drop-shadow-sm">
                Suas motos. <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-indigo-600 animate-gradient-x">
                  Seu Império Digital.
                </span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed backdrop-blur-sm bg-white/30 rounded-xl p-4">
                Crie um catálogo profissional em segundos. Sem código, sem complicações. Apenas vendas.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1">
                    Começar Grátis <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/demo-store" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full h-14 px-8 text-lg rounded-full border-2 border-gray-200 hover:border-primary/50 hover:bg-white/80 text-gray-600 hover:text-primary transition-all backdrop-blur-sm bg-white/50">
                    Ver Demonstração
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Feature Grid (Asymmetric) */}
        <section className="px-6 py-24 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                Design que vende por você.
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                Ferramentas poderosas escondidas em uma interface simples e elegante.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
              {/* Card 1: Mobile First - Large */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="md:col-span-2 bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-primary/5 transition-all group overflow-hidden relative"
              >
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <Smartphone className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Mobile-First Nativo</h3>
                    <p className="text-gray-500 text-lg max-w-md">
                      Seu catálogo carrega instantaneamente em qualquer dispositivo.
                      Uma experiência de aplicativo, sem precisar baixar nada.
                    </p>
                  </div>
                  <div className="mt-8 flex gap-2">
                    <div className="h-2 w-20 rounded-full bg-primary/20" />
                    <div className="h-2 w-10 rounded-full bg-gray-100" />
                  </div>
                </div>
                {/* Decorative blob for big card */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br from-primary/10 to-purple-100/50 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 ease-out" />
              </motion.div>

              {/* Card 2: WhatsApp - Tall */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-[2rem] p-8 border border-green-100/50 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:rotate-12 transition-transform duration-300">
                    <MessageCircle className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">WhatsApp Direto</h3>
                  <p className="text-gray-600">
                    Botão de compra que leva o cliente direto para o seu WhatsApp.
                    Sem intermediários.
                  </p>
                </div>
              </motion.div>

              {/* Card 3: Identity */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-[-6deg] transition-transform duration-300">
                  <Palette className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Sua Marca</h3>
                <p className="text-gray-500">
                  Logo, cores e identidade. Tudo personalizável para refletir sua loja.
                </p>
              </motion.div>

              {/* Card 4: Speed */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="md:col-span-2 bg-gray-900 rounded-[2rem] p-8 md:p-12 relative overflow-hidden group"
              >
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Rocket className="h-6 w-6 text-yellow-400" />
                      <span className="text-yellow-400 font-bold tracking-wider text-sm uppercase">Alta Performance</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">SEO Otimizado</h3>
                    <p className="text-gray-400 max-w-md">
                      Sua loja aparece no Google. Estrutura otimizada para buscadores e carregamento instantâneo.
                    </p>
                  </div>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full">
                    Saiba mais
                  </Button>
                </div>
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefits Section (Dark Mode Contrast) */}
        <section className="bg-gray-900 py-24 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[150px] opacity-30 pointer-events-none" />

          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
              Por que escolher o EletroMoto?
            </h2>
            <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
              Desenvolvido especificamente para o mercado de mobilidade elétrica no Brasil.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { text: "Link único para bio (Instagram/TikTok)", icon: Zap },
                { text: "Sem comissões sobre vendas", icon: CheckCircle },
                { text: "Especificações técnicas de fábrica", icon: Sparkles },
                { text: "Preços visíveis ou sob consulta", icon: Shield },
                { text: "QR Code automático para loja física", icon: Smartphone },
                { text: "Painel administrativo simplificado", icon: Rocket },
                { text: "Galeria de fotos ilimitada", icon: Palette },
                { text: "Suporte brasileiro via WhatsApp", icon: MessageCircle },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 transition-colors group"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-gray-200 font-medium">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-32 text-center bg-white relative overflow-hidden">
          <div className="max-w-3xl mx-auto relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 tracking-tighter"
            >
              Pronto para evoluir?
            </motion.h2>
            <p className="text-xl text-gray-500 mb-10">
              Junte-se a centenas de lojas que já digitalizaram seu catálogo.
            </p>
            <Link href="/register">
              <Button size="lg" className="h-16 px-10 text-xl rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all">
                Criar Catálogo Agora
              </Button>
            </Link>
            <p className="mt-4 text-sm text-gray-400">Teste grátis de 14 dias • Sem cartão de crédito</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 relative flex items-center justify-center">
                <Image src="/brand/icon.svg" alt="Logo" fill className="object-contain" />
              </div>
              <span className="text-lg font-bold text-gray-900">EletroMoto</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-500">
              <Link href="#" className="hover:text-primary transition-colors">Termos</Link>
              <Link href="#" className="hover:text-primary transition-colors">Privacidade</Link>
              <Link href="#" className="hover:text-primary transition-colors">Contato</Link>
            </div>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} EletroMoto Catálogo.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
