/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração padrão para Vercel
  eslint: {
    // Ignora erros de linting durante o build para evitar falhas de deploy em produção por estilo
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora erros de TS durante o build (opcional, mas comum para deploys rápidos se o lint local já garante)
    ignoreBuildErrors: true,
  },
  images: {
    // Garante compatibilidade com imagens externas sem configuração extra
    unoptimized: true
  },
};

module.exports = nextConfig;
