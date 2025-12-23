"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
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
} from "lucide-react";

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
  products: Product[];
}

interface PublicCatalogProps {
  store: Store;
}

export function PublicCatalog({ store }: PublicCatalogProps) {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  const primaryColor = store?.primaryColor ?? '#22c55e';
  const backgroundColor = store?.backgroundColor ?? '#f8fafc';
  const products = store?.products ?? [];

  const allImages = React.useMemo(() => {
    if (!selectedProduct) return [];
    return [selectedProduct.mainImageUrl, ...(selectedProduct.galleryUrls ?? [])].filter(Boolean);
  }, [selectedProduct]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : (allImages?.length ?? 1) - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < (allImages?.length ?? 1) - 1 ? prev + 1 : 0));
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
  };

  const getDisplayPrice = (product: Product) => {
    if (!product?.showPrice) return null;
    if (product?.hasDiscount && product?.discountPrice) {
      return {
        current: product.discountPrice,
        original: product.basePrice,
        hasDiscount: true,
      };
    }
    return {
      current: product?.basePrice,
      original: null,
      hasDiscount: false,
    };
  };

  const safeColors = (colors: ColorOption[] | null | undefined): ColorOption[] => {
    if (!colors) return [];
    if (Array.isArray(colors)) return colors;
    return [];
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor }}>
      {/* Header */}
      <header
        className="relative"
        style={{ backgroundColor: primaryColor }}
      >
        {store?.bannerUrl && (
          <div className="absolute inset-0">
            <Image
              src={store.bannerUrl}
              alt="Banner"
              fill
              className="object-cover opacity-30"
              priority
            />
          </div>
        )}
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 text-center">
          {store?.logoUrl ? (
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-white shadow-lg relative">
              <Image
                src={store.logoUrl}
                alt={store?.name ?? ''}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center bg-white/20 shadow-lg"
            >
              <Zap className="h-12 w-12 text-white" />
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {store?.name ?? 'Loja'}
          </h1>
          {store?.description && (
            <p className="text-white/90 mb-4 max-w-md mx-auto">
              {store.description}
            </p>
          )}
          {(store?.city || store?.state) && (
            <div className="flex items-center justify-center gap-1 text-white/80 text-sm mb-4">
              <MapPin className="h-4 w-4" />
              <span>
                {[store?.city, store?.state].filter(Boolean).join(" - ")}
              </span>
            </div>
          )}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="whatsapp"
              onClick={() => openStoreWhatsApp(store?.name ?? '', store?.whatsapp ?? '')}
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </Button>
            {store?.instagram && (
              <a
                href={`https://instagram.com/${store.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Instagram className="h-5 w-5" />
                  Instagram
                </Button>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Nossos Veículos ({products.length})
        </h2>

        {products.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Zap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum veículo disponível no momento</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product, index) => {
              const priceInfo = getDisplayPrice(product);
              const colors = safeColors(product?.availableColors);
              
              return (
                <motion.div
                  key={product?.id ?? index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square relative bg-gray-100">
                      {product?.mainImageUrl && (
                        <Image
                          src={product.mainImageUrl}
                          alt={product?.name ?? ''}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      )}
                      <Badge
                        variant={product?.category as any ?? 'default'}
                        className="absolute top-3 left-3"
                      >
                        {CATEGORY_LABELS[product?.category as ProductCategory] ?? product?.category ?? ''}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product?.name ?? 'Sem nome'}
                      </h3>
                      
                      {/* Preço */}
                      {priceInfo && (
                        <div className="mb-3">
                          {priceInfo.hasDiscount && priceInfo.original && (
                            <span className="text-sm text-gray-400 line-through mr-2">
                              {formatPrice(priceInfo.original)}
                            </span>
                          )}
                          <span
                            className="text-lg font-bold"
                            style={{ color: primaryColor }}
                          >
                            {formatPrice(priceInfo.current)}
                          </span>
                        </div>
                      )}
                      
                      {/* Cores */}
                      {colors.length > 0 && (
                        <div className="flex items-center gap-1.5 mb-4">
                          {colors.slice(0, 5).map((color, idx) => (
                            <span
                              key={`${color?.value ?? ''}-${idx}`}
                              className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
                              style={{ backgroundColor: color?.value ?? '#000' }}
                              title={color?.name ?? ''}
                            />
                          ))}
                          {colors.length > 5 && (
                            <span className="text-xs text-gray-500">+{colors.length - 5}</span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => openProductModal(product)}
                        >
                          <Info className="h-4 w-4" />
                          Detalhes
                        </Button>
                        <Button
                          variant="whatsapp"
                          className="flex-1"
                          onClick={() => openWhatsApp(product?.name ?? '', store?.whatsapp ?? '')}
                        >
                          <MessageCircle className="h-4 w-4" />
                          WhatsApp
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* FAQ Section */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Dúvidas Frequentes sobre Motos Elétricas
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS?.map?.((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 pr-4">
                    {item?.question ?? ''}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600">{item?.answer ?? ''}</p>
                  </div>
                )}
              </div>
            )) ?? []}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-green-500" />
            <span className="text-white font-medium">EletroMoto Catálogo</span>
          </div>
          <p className="text-gray-400 text-sm">
            Catálogo digital de {store?.name ?? 'Loja'}
          </p>
        </div>
      </footer>

      {/* Product Detail Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name ?? ''}
      >
        {selectedProduct && (
          <div className="space-y-6">
            {/* Image Gallery */}
            <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden -mx-4 -mt-4">
              {allImages[currentImageIndex] && (
                <Image
                  src={allImages[currentImageIndex]}
                  alt={selectedProduct?.name ?? ''}
                  fill
                  className="object-contain"
                />
              )}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Category & Price */}
            <div className="flex items-center justify-between">
              <Badge variant={selectedProduct?.category as any ?? 'default'}>
                {CATEGORY_LABELS[selectedProduct?.category as ProductCategory] ?? selectedProduct?.category ?? ''}
              </Badge>
              {(() => {
                const priceInfo = getDisplayPrice(selectedProduct);
                if (!priceInfo) return null;
                return (
                  <div className="text-right">
                    {priceInfo.hasDiscount && priceInfo.original && (
                      <span className="text-sm text-gray-400 line-through block">
                        {formatPrice(priceInfo.original)}
                      </span>
                    )}
                    <span
                      className="text-2xl font-bold"
                      style={{ color: primaryColor }}
                    >
                      {formatPrice(priceInfo.current)}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Cores Disponíveis */}
            {(() => {
              const colors = safeColors(selectedProduct?.availableColors);
              if (colors.length === 0) return null;
              return (
                <div className="p-3 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium text-gray-700">Cores Disponíveis</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color, idx) => (
                      <div
                        key={`${color?.value ?? ''}-${idx}`}
                        className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-full border border-gray-200"
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color?.value ?? '#000' }}
                        />
                        <span className="text-xs text-gray-700">{color?.name ?? ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3">
              {selectedProduct?.motorPower && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl">
                  <Zap className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Potência</p>
                    <p className="font-medium text-gray-900">{selectedProduct.motorPower}</p>
                  </div>
                </div>
              )}
              {selectedProduct?.autonomy && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl">
                  <Battery className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Autonomia</p>
                    <p className="font-medium text-gray-900">{selectedProduct.autonomy}</p>
                  </div>
                </div>
              )}
              {selectedProduct?.maxSpeed && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl">
                  <Gauge className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Vel. Máxima</p>
                    <p className="font-medium text-gray-900">{selectedProduct.maxSpeed}</p>
                  </div>
                </div>
              )}
              {selectedProduct?.chargeTime && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Tempo de Carga</p>
                    <p className="font-medium text-gray-900">{selectedProduct.chargeTime}</p>
                  </div>
                </div>
              )}
              {selectedProduct?.battery && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl">
                  <Battery className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Bateria</p>
                    <p className="font-medium text-gray-900">{selectedProduct.battery}</p>
                  </div>
                </div>
              )}
              {selectedProduct?.maxWeight && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl">
                  <Weight className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Peso Máximo</p>
                    <p className="font-medium text-gray-900">{selectedProduct.maxWeight}</p>
                  </div>
                </div>
              )}
            </div>

            {selectedProduct?.technicalDetails && (
              <div className="p-3 bg-gray-50 rounded-2xl">
                <p className="text-xs text-gray-500 mb-1">Detalhes Técnicos</p>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                  {selectedProduct.technicalDetails}
                </p>
              </div>
            )}

            {/* WhatsApp Button - Always visible */}
            <div className="sticky bottom-0 pt-4 bg-white border-t border-gray-100">
              <Button
                variant="whatsapp"
                className="w-full"
                onClick={() => openWhatsApp(selectedProduct?.name ?? '', store?.whatsapp ?? '')}
              >
                <MessageCircle className="h-5 w-5" />
                Gostei da {selectedProduct?.name ?? 'moto'}!
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
