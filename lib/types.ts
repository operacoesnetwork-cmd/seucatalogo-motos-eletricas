export interface ColorOption {
  name: string;
  value: string;
  isCustom?: boolean;
}

export interface Store {
  id: string;
  userId: string;
  slug: string;
  name: string;
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
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  category: ProductCategory;
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
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCategory = 'autopropelido' | 'ciclomotor' | 'moto_eletrica' | 'triciclo' | 'outros';

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  autopropelido: 'Autopropelido',
  ciclomotor: 'Ciclomotor',
  moto_eletrica: 'Moto Elétrica',
  triciclo: 'Triciclo',
  outros: 'Outros',
};

export const CATEGORY_OPTIONS = [
  { value: 'autopropelido', label: 'Autopropelido' },
  { value: 'ciclomotor', label: 'Ciclomotor' },
  { value: 'moto_eletrica', label: 'Moto Elétrica' },
  { value: 'triciclo', label: 'Triciclo' },
  { value: 'outros', label: 'Outros' },
] as const;

export const FAQ_ITEMS = [
  {
    question: 'Preciso de habilitação para pilotar uma moto elétrica?',
    answer: 'Depende da categoria do veículo. Segundo a Resolução 996 do CONTRAN, veículos autopropelidos (até 32 km/h e 1000W) não exigem CNH.',
  },
  {
    question: 'Preciso emplacar minha moto elétrica?',
    answer: 'Veículos autopropelidos não precisam de emplacamento, seguindo todos os critérios estabelecidos pela Resolução 996 do CONTRAN.',
  },
  {
    question: 'Posso carregar em qualquer tomada?',
    answer: 'Sim! A maioria das motos elétricas pode ser carregada em tomadas residenciais comuns (110V ou 220V).',
  },
  {
    question: 'Quanto tempo dura a bateria?',
    answer: 'As baterias modernas usadas hoje em dia duram em média de 3 a 5 anos. Com uso adequado e manutenção correta, podem durar ainda mais. Já a autonomia (distância de percurso) por carga varia de 40 a 150 km dependendo do modelo.',
  },
];

export interface StoreWithProducts extends Store {
  products: Product[];
}
