import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

export function formatWhatsApp(phone: string): string {
  const cleaned = phone?.replace(/\D/g, '') ?? '';
  return cleaned;
}

export function openWhatsApp(productName: string, storeWhatsapp: string): void {
  const cleanPhone = formatWhatsApp(storeWhatsapp);
  const message = encodeURIComponent(
    `Olá! Tenho interesse na ${productName} que vi no seu catálogo digital.`
  );
  window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
}

export function openStoreWhatsApp(storeName: string, storeWhatsapp: string): void {
  const cleanPhone = formatWhatsApp(storeWhatsapp);
  const message = encodeURIComponent(
    `Olá! Vi o catálogo da ${storeName} e gostaria de mais informações.`
  );
  window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
}

export function formatPhoneDisplay(phone: string): string {
  const cleaned = phone?.replace(/\D/g, '') ?? '';
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone ?? '';
}
