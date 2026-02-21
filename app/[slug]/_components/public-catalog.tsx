"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { CATEGORY_LABELS, FAQ_ITEMS, type ProductCategory, type ColorOption } from "@/lib/types";
import { formatPrice, openWhatsApp, openStoreWhatsApp } from "@/lib/utils";
import {
  MessageCircle,
  Instagram,
  MapPin,
  ChevronDown,
  ChevronUp,
  Zap,
  Battery,
  Gauge,
  Clock,
  Weight,
  Palette,
  Info,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { ShareButton } from "@/components/ui/share-button";
import { cn } from "@/lib/utils";
import Script from "next/script";

// --- Types ---

interface Product {
  id: string;
  name: string;
  category: string;
  mainImageUrl: string;
  galleryUrls: string[];
  basePrice: number | null;
  discountPrice: number | null;
  showPrice: boolean;
  hasDiscount: boolean;
  motorPower: string | null;
  autonomy: string | null;
  battery: string | null;
  maxSpeed: string | null;
  chargeTime: string | null;
  maxWeight: string | null;
  availableColors: ColorOption[];
  technicalDetails: string | null;
}

interface Store {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  whatsapp: string;
  instagram: string | null;
  city: string | null;
  state: string | null;
  metaPixelId?: string | null;
  googleAdsId?: string | null;
  products: Product[];
}

interface PublicCatalogProps {
  store: Store;
}

// --- Components ---

function StoreHeader({ store }: { store: Store }) {
  const primaryColor = store.primaryColor || '#7c3aed';

  const handleStoreWhatsApp = (storeName: string, phone: string) => {
    try {
      if (typeof window !== "undefined") {
        if (store.metaPixelId) {
          const fire = () => {
            if (typeof (window as any).fbq === 'function') {
              console.log('[Pixel] Disparando Contact para:', storeName);
              (window as any).fbq('track', 'Contact', { content_name: storeName });
            }
          };
          if (typeof (window as any).fbq === 'function') fire();
          else window.addEventListener('load', fire, { once: true });

          if (navigator.sendBeacon) {
            navigator.sendBeacon(`https://www.facebook.com/tr?id=${store.metaPixelId}&ev=Contact&noscript=1`);
          }
        }
        if (store.googleAdsId && typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'generate_lead', {
            event_category: 'engagement',
            event_label: 'WhatsApp Store General'
          });
        }
      }
    } catch (e) {
      console.error("Tracking error:", e);
    }

    // Pequeno atraso para garantir o disparo da requisição de rastreamento antes de abrir nova aba
    setTimeout(() => {
      openStoreWhatsApp(storeName, phone);
    }, 300);
  };

  return (
    <div className="relative overflow-hidden bg-gray-900 pb-20">
      {/* Banner Background */}
      <div className="absolute inset-0 z-0">
        {store.bannerUrl ? (
          <Image
            src={store.bannerUrl}
            alt="Banner"
            fill
            className="object-cover opacity-60 blur-sm"
            priority
          />
        ) : (
          <div
            className="w-full h-full opacity-30"
            style={{ backgroundColor: primaryColor }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-10 sm:pt-14">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
          {/* Logo */}
          <div className="relative">
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl bg-white flex items-center justify-center">
              {store.logoUrl ? (
                <Image
                  src={store.logoUrl}
                  alt={store.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <Zap className="h-14 w-14 text-gray-300" />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="absolute top-0 right-0 p-4 z-20">
            <ShareButton
              url={typeof window !== 'undefined' ? window.location.href : ''}
              title={store.name}
              text={`Confira o catálogo da ${store.name}`}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              iconOnly
            />
          </div>

          <div className="flex-1 pb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              {store.name}
            </h1>
            {store.description && (
              <p className="text-gray-300 max-w-xl text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-none mx-auto md:mx-0">
                {store.description}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm text-gray-400">
              {(store.city || store.state) && (
                <div className="flex items-center gap-1.5 bg-white/5 py-1 px-3 rounded-full backdrop-blur-sm border border-white/10">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>
                    {[store.city, store.state].filter(Boolean).join(" - ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Social Actions */}
          <div className="flex flex-col sm:flex-row gap-3 min-w-[200px]">
            <Button
              className="w-full shadow-lg hover:shadow-xl transition-all font-semibold"
              style={{ backgroundColor: '#25D366', color: 'white' }}
              onClick={() => handleStoreWhatsApp(store.name, store.whatsapp)}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Falar no WhatsApp
            </Button>
            {store.instagram && (
              <Button
                variant="outline"
                className="w-full border-white/20 text-white bg-white/5 hover:bg-white/10 hover:text-white"
                onClick={() => window.open(`https://instagram.com/${store.instagram!.replace('@', '')}`, '_blank')}
              >
                <Instagram className="h-5 w-5 mr-2" />
                Instagram
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Catalog Component ---

export function PublicCatalog({ store }: PublicCatalogProps) {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);
  const [isAtBottom, setIsAtBottom] = React.useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const atBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 40;
    setIsAtBottom(atBottom);
  };

  const primaryColor = store.primaryColor || '#7c3aed';
  // Use a lighter version of the background or white if the store bg is too dark/specific, 
  // but for now, we'll respect custom BG or default to gray-50
  const appBgColor = store.backgroundColor || '#f9fafb';

  // --- Modal Helpers & Tracking ---

  const trackEvent = (eventName: string, params?: object) => {
    if (typeof window === "undefined") return;

    const fire = () => {
      if (typeof (window as any).fbq === 'function') {
        console.log(`[Pixel] Tentando disparar ${eventName} para:`, params);
        (window as any).fbq('track', eventName, params);
      }
    };

    // Se fbq já está carregado, dispara imediatamente
    if (typeof (window as any).fbq === 'function') {
      fire();
    } else {
      // Caso contrário, aguarda o script carregar
      window.addEventListener('load', fire, { once: true });
    }
  };

  const allImages = React.useMemo(() => {
    if (!selectedProduct) return [];
    return [selectedProduct.mainImageUrl, ...(selectedProduct.galleryUrls ?? [])].filter(Boolean);
  }, [selectedProduct]);

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    setIsAtBottom(false);
    window.history.pushState({ modalOpen: true }, "");

    // Tracking: ViewContent / view_item
    try {
      if (typeof window !== "undefined") {
        const itemData = {
          content_name: product.name,
          content_category: product.category
        };
        // Meta Pixel
        if (store.metaPixelId) {
          trackEvent('ViewContent', { content_name: product.name, content_category: product.category });

          // Usa sendBeacon se disponível
          const pixelUrl = `https://www.facebook.com/tr?id=${store.metaPixelId}&ev=ViewContent&noscript=1&cd[content_name]=${encodeURIComponent(product.name)}&cd[content_category]=${encodeURIComponent(product.category || '')}`;
          if (navigator.sendBeacon) {
            navigator.sendBeacon(pixelUrl);
          }
        }
        // Google Ads
        if (store.googleAdsId && typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'view_item', {
            items: [
              {
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.discountPrice || product.basePrice || 0,
              }
            ]
          });
        }
      }
    } catch (e) {
      console.error("Tracking error:", e);
    }
  };

  const handleManualClose = React.useCallback(() => {
    setSelectedProduct(null);
    if (window.history.state?.modalOpen) {
      window.history.back();
    }
  }, []);

  const handleWhatsApp = (productName: string, productCategory: string, phone: string) => {
    try {
      if (typeof window !== "undefined") {
        // Meta Pixel
        if (store.metaPixelId) {
          trackEvent('Contact', { content_name: productName, content_category: productCategory });

          // Usa sendBeacon se disponível (não é cancelado pelo navegador)
          const pixelUrl = `https://www.facebook.com/tr?id=${store.metaPixelId}&ev=Contact&noscript=1&cd[content_name]=${encodeURIComponent(productName)}&cd[content_category]=${encodeURIComponent(productCategory || '')}`;
          if (navigator.sendBeacon) {
            navigator.sendBeacon(pixelUrl);
          }
        }
        // Google Ads
        if (store.googleAdsId && typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'generate_lead', {
            event_category: 'engagement',
            event_label: 'WhatsApp Click',
            event_action: productName
          });
        }
      }
    } catch (e) {
      console.error("Tracking error:", e);
    }

    // Atraso de 300ms para garantir o disparo da requisição de rastreamento antes de redirecionar
    setTimeout(() => {
      openWhatsApp(productName, phone);
    }, 300);
  };

  const handleStoreWhatsApp = (storeName: string, phone: string) => {
    try {
      if (typeof window !== "undefined") {
        if (store.metaPixelId && (window as any).fbq) {
          (window as any).fbq('track', 'Contact');
        }
        if (store.googleAdsId && (window as any).gtag) {
          (window as any).gtag('event', 'generate_lead', {
            event_category: 'engagement',
            event_label: 'WhatsApp Store General'
          });
        }
      }
    } catch (e) {
      console.error("Tracking error:", e);
    }
    openStoreWhatsApp(storeName, phone);
  };

  React.useEffect(() => {
    const handlePopState = () => {
      if (selectedProduct) {
        setSelectedProduct(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectedProduct]);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  // --- Helper to get safe colors array ---
  const safeColors = (colors: ColorOption[] | null | undefined): ColorOption[] => {
    return Array.isArray(colors) ? colors : [];
  };

  return (
    <>
      {/* Tracking Scripts */}
      {store.metaPixelId && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive" dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${store.metaPixelId}');
              fbq('track', 'PageView');
            `
          }} />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${store.metaPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {store.googleAdsId && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${store.googleAdsId}`}
          />
          <Script id="google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${store.googleAdsId}');
            `
          }} />
        </>
      )}

      <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: appBgColor }}>
        <StoreHeader store={store} />

        {/* Main Content Area */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 -mt-8 relative z-20 pb-8">

          {/* Products Grid */}
          {store.products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum veículo disponível</h3>
              <p className="text-gray-500 max-w-xs mx-auto">Esta loja ainda não cadastrou produtos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {store.products.map((product, index) => {
                  const colors = safeColors(product.availableColors);
                  const hasDiscount = product.hasDiscount && product.discountPrice;
                  const displayPrice = hasDiscount ? product.discountPrice : product.basePrice;

                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        className="group h-full flex flex-col overflow-hidden border-transparent shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer rounded-2xl ring-1 ring-gray-100"
                        onClick={() => openProductModal(product)}
                        style={{ '--store-primary': primaryColor } as React.CSSProperties}
                      >
                        {/* Image Area */}
                        <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden group-hover:opacity-100">
                          {product.mainImageUrl ? (
                            <Image
                              src={product.mainImageUrl}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-300">
                              <Zap className="h-12 w-12" />
                            </div>
                          )}

                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.category && (
                              <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm shadow-sm hover:bg-white">
                                {CATEGORY_LABELS[product.category as ProductCategory] ?? product.category}
                              </Badge>
                            )}
                            {hasDiscount && (
                              <Badge variant="destructive" className="shadow-sm">
                                Oferta
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Content Area */}
                        <CardContent className="p-4 flex-1 flex flex-col">
                          <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-[var(--store-primary)] transition-colors line-clamp-2">
                            {product.name}
                          </h3>

                          {/* Specs Mini Summary */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3 mt-1">
                            {product.motorPower && (
                              <div className="flex items-center gap-1" title="Potência">
                                <Zap className="h-3 w-3" /> {product.motorPower}
                              </div>
                            )}
                            {product.maxSpeed && (
                              <div className="flex items-center gap-1" title="Velocidade Máxima">
                                <Gauge className="h-3 w-3" /> {product.maxSpeed}
                              </div>
                            )}
                            {product.autonomy && (
                              <div className="flex items-center gap-1" title="Autonomia">
                                <Battery className="h-3 w-3" /> {product.autonomy}
                              </div>
                            )}
                          </div>

                          {/* Colors Preview */}
                          {colors.length > 0 && (
                            <div className="flex items-center gap-1 mb-3">
                              {colors.slice(0, 4).map((c, i) => (
                                <div
                                  key={i}
                                  className="w-3.5 h-3.5 rounded-full border border-gray-200 ring-1 ring-transparent group-hover:ring-gray-300 transition-all"
                                  style={{ backgroundColor: c.value }}
                                  title={c.name}
                                />
                              ))}
                              {colors.length > 4 && (
                                <span className="text-[10px] text-gray-400">+{colors.length - 4}</span>
                              )}
                            </div>
                          )}

                          <div className="mt-auto pt-3 border-t border-gray-50 flex flex-col gap-2">
                            <div className="flex items-end justify-between">
                              <div className="flex flex-col">
                                {product.showPrice ? (
                                  <>
                                    {hasDiscount && (
                                      <span className="text-xs text-gray-400 line-through mb-0.5">
                                        {formatPrice(product.basePrice)}
                                      </span>
                                    )}
                                    <span className="text-lg font-bold" style={{ color: primaryColor }}>
                                      {formatPrice(displayPrice)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-sm font-medium text-gray-500">Consulte valor</span>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-[auto_1fr] gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-10 w-10 p-0 rounded-full border-gray-200 hover:bg-gray-50 hover:text-primary transition-colors shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openProductModal(product);
                                }}
                                title="Mais detalhes"
                              >
                                <Info className="h-5 w-5 text-gray-600" />
                              </Button>

                              <motion.div
                                animate={{ scale: [1, 1.03, 1] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                className="w-full"
                              >
                                <Button
                                  size="sm"
                                  className="h-10 w-full rounded-full shadow-md hover:shadow-xl transition-all font-semibold active:scale-95 flex items-center justify-center gap-2 group/btn"
                                  style={{ backgroundColor: '#25D366', color: 'white' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleWhatsApp(product.name, product.category, store.whatsapp);
                                  }}
                                >
                                  <MessageCircle className="h-4 w-4 fill-white/20" />
                                  <span>Tenho Interesse</span>
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-to-b from-white to-gray-50 py-12 relative overflow-hidden">
          {/* Decorative top line */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          <div className="max-w-3xl mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <div
                className="inline-flex items-center justify-center p-3 rounded-2xl mb-5 shadow-sm ring-1 ring-black/5"
                style={{
                  backgroundColor: `${primaryColor}15`, // 15 = ~8% opacity hex equivalent
                  color: primaryColor
                }}
              >
                <Info className="h-6 w-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                Ficou com alguma dúvida?
              </h2>
              <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
                Confira as respostas para as perguntas mais comuns sobre nossos veículos elétricos.
              </p>
            </div>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = expandedFaq === index;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={cn(
                      "bg-white rounded-2xl overflow-hidden transition-all duration-300",
                      isOpen
                        ? "shadow-lg ring-1 ring-black/5"
                        : "shadow-sm hover:shadow-md border border-gray-100 hover:border-gray-200"
                    )}
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                    >
                      <span className={cn(
                        "font-semibold text-base sm:text-lg pr-8 transition-colors duration-300",
                        isOpen ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                      )}>
                        {item.question}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-gray-400 transition-transform duration-300 ease-in-out flex-shrink-0",
                          isOpen && "rotate-180"
                        )}
                        style={isOpen ? { color: primaryColor } : undefined}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed text-base border-t border-dashed border-gray-100 mt-[-4px] pt-4">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* FAQ CTA */}
            <div className="mt-14 text-center">
              <p className="text-gray-500 text-sm mb-4 font-medium">Não encontrou o que procurava?</p>
              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="inline-block"
              >
                <Button
                  onClick={() => handleStoreWhatsApp(store.name, store.whatsapp)}
                  className="rounded-full pl-6 pr-8 h-12 shadow-lg hover:shadow-green-200/50 hover:-translate-y-0.5 transition-all text-white font-semibold group"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <MessageCircle className="h-5 w-5 mr-3 fill-current group-hover:scale-110 transition-transform" />
                  Falar com um especialista
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Modern Footer */}
        <footer className="bg-[#160b25] text-white py-12 border-t border-[#2a1740]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center backdrop-blur-sm">
                <Zap className="h-5 w-5 text-white/50 fill-white/50" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white/50">EletroMoto</span>
            </div>

            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Desenvolvido por <a href="/" className="font-medium hover:text-gray-400 transition-colors">NTEC</a>.
            </p>
          </div>
        </footer>

        {/* Product Detail Modal */}
        <Modal
          isOpen={!!selectedProduct}
          onClose={handleManualClose}
          title=""
          className="max-w-5xl p-0 overflow-hidden bg-white gap-0 w-full h-[100dvh] max-h-[100dvh] sm:h-auto sm:max-h-[90vh] mx-0 sm:mx-4 rounded-none sm:rounded-2xl"
          contentClassName="p-0 h-full"
        >
          {selectedProduct && (
            <div className="flex flex-col lg:flex-row h-full lg:h-[600px]">
              {/* Gallery Section */}
              <div className="w-full lg:w-3/5 aspect-[4/3] lg:aspect-auto bg-gray-100 relative group flex items-center justify-center overflow-hidden shrink-0">
                {/* Overlay Badges */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedProduct.category as any} className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-md text-gray-800 shadow-sm border border-white/20">
                      {CATEGORY_LABELS[selectedProduct.category as ProductCategory] ?? selectedProduct.category}
                    </Badge>
                    {selectedProduct.hasDiscount && selectedProduct.discountPrice && (
                      <Badge variant="destructive" className="bg-red-500 shadow-sm text-white">Oferta</Badge>
                    )}
                  </div>
                </div>

                <div className="relative w-full h-full">
                  <AnimatePresence initial={false} mode="wait">
                    {allImages[currentImageIndex] && (
                      <motion.div
                        key={currentImageIndex}
                        className="relative w-full h-full"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                          const swipe = Math.abs(offset.x) * velocity.x;
                          if (swipe < -10000 || offset.x < -100) {
                            nextImage();
                          } else if (swipe > 10000 || offset.x > 100) {
                            prevImage();
                          }
                        }}
                      >
                        <Image
                          src={allImages[currentImageIndex]}
                          alt={selectedProduct.name}
                          fill
                          className="object-cover"
                          priority
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                {allImages.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg text-gray-800 transition-all opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0">
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg text-gray-800 transition-all opacity-0 group-hover:opacity-100 translate-x-[10px] group-hover:translate-x-0">
                      <ChevronRight className="h-6 w-6" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/10 backdrop-blur-md rounded-full z-10">
                      {allImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={cn(
                            "w-2.5 h-2.5 rounded-full transition-all",
                            idx === currentImageIndex ? "bg-white scale-110" : "bg-white/40 hover:bg-white/60"
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Info Section */}
              <div className="w-full lg:w-2/5 flex flex-col h-full overflow-hidden bg-white relative">
                <div
                  className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto custom-scrollbar pb-32 lg:pb-44"
                  onScroll={handleScroll}
                >
                  <div className="mb-4 mt-2">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-4">
                      {selectedProduct.name}
                    </h2>

                    {/* Price */}
                    {selectedProduct.showPrice && (
                      <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-gray-100">
                        {selectedProduct.hasDiscount && selectedProduct.discountPrice ? (
                          <>
                            <span className="text-3xl font-extrabold" style={{ color: primaryColor }}>
                              {formatPrice(selectedProduct.discountPrice)}
                            </span>
                            <span className="text-lg text-gray-400 line-through">
                              {formatPrice(selectedProduct.basePrice)}
                            </span>
                          </>
                        ) : (
                          <span className="text-3xl font-extrabold" style={{ color: primaryColor }}>
                            {formatPrice(selectedProduct.basePrice)}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {[
                        { icon: Zap, label: "Potência", value: selectedProduct.motorPower },
                        { icon: Battery, label: "Autonomia", value: selectedProduct.autonomy },
                        { icon: Gauge, label: "Velocidade", value: selectedProduct.maxSpeed },
                        { icon: Clock, label: "Recarga", value: selectedProduct.chargeTime },
                      ].filter(s => s.value).map((spec, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-3 flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium uppercase">
                            <spec.icon className="h-3.5 w-3.5" />
                            {spec.label}
                          </div>
                          <span className="text-sm font-semibold text-gray-900 truncate">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Description/Details */}
                    {selectedProduct.technicalDetails && (
                      <div className="mb-8">
                        <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Ficha Técnica</h4>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                          {selectedProduct.technicalDetails}
                        </p>
                      </div>
                    )}

                    {/* Colors */}
                    {safeColors(selectedProduct.availableColors).length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Cores Disponíveis</h4>
                        <div className="flex flex-wrap gap-2">
                          {safeColors(selectedProduct.availableColors).map((color, idx) => (
                            <div key={idx} className="flex items-center gap-2 pl-1 pr-3 py-1 bg-gray-50 rounded-full border border-gray-200">
                              <div className="w-5 h-5 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: color.value }} />
                              <span className="text-xs font-medium text-gray-700">{color.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Fixed Bottom CTA with dynamic background */}
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 p-4 lg:p-6 shrink-0 transition-all duration-300 z-30 pb-6 lg:pb-6",
                  isAtBottom
                    ? "bg-white border-t border-gray-100"
                    : "bg-gradient-to-t from-white/80 to-transparent backdrop-blur-[2px] border-t border-transparent"
                )}>
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    className="w-full"
                  >
                    <Button
                      className="w-full h-12 sm:h-14 text-lg font-semibold shadow-xl transition-all active:scale-[0.98] rounded-xl sm:rounded-full"
                      style={{ backgroundColor: '#25D366' }}
                      onClick={() => handleWhatsApp(selectedProduct.name, selectedProduct.category, store.whatsapp)}
                    >
                      <MessageCircle className="h-6 w-6 mr-2 fill-current" />
                      Tenho Interesse
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
