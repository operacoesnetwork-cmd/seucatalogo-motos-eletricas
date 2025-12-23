import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create test user
  const hashedPassword = await bcrypt.hash("johndoe123", 10);

  const user = await prisma.user.upsert({
    where: { email: "john@doe.com" },
    update: {},
    create: {
      email: "john@doe.com",
      password: hashedPassword,
      name: "John Doe",
      role: "USER",
    },
  });

  // Create super admin user
  const adminPassword = await bcrypt.hash("admin123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@ntec.network" },
    update: { role: "SUPER_ADMIN" },
    create: {
      email: "admin@ntec.network",
      password: adminPassword,
      name: "Super Admin",
      role: "SUPER_ADMIN",
    },
  });

  console.log("Created admin user:", adminUser.email);

  console.log("Created user:", user.email);

  // Create demo store
  const demoStore = await prisma.store.upsert({
    where: { slug: "demo-store" },
    update: {},
    create: {
      userId: user.id,
      slug: "demo-store",
      name: "EletroMotos Demo",
      description: "Loja demonstração de motos elétricas. Veja como seu catálogo pode ficar!",
      whatsapp: "11999999999",
      instagram: "@eletromotos",
      city: "São Paulo",
      state: "SP",
      primaryColor: "#22c55e",
      secondaryColor: "#16a34a",
    },
  });

  console.log("Created store:", demoStore.name);

  // Create demo products
  const products = [
    {
      name: "Scooter Elétrica X1000",
      category: "ciclomotor",
      mainImageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      galleryUrls: [],
      basePrice: 8990,
      discountPrice: 7990,
      showPrice: true,
      motorPower: "1500W",
      autonomy: "60-80 km",
      battery: "Lítio 60V 20Ah",
      maxSpeed: "45 km/h",
      chargeTime: "4-6 horas",
      maxWeight: "120 kg",
      availableColors: [
        { name: "Preto", value: "#000000" },
        { name: "Branco", value: "#ffffff" },
        { name: "Vermelho", value: "#ef4444" }
      ],
      technicalDetails: "Freios a disco dianteiro e traseiro. Suspensão dianteira telescópica. Painel digital LCD.",
      isActive: true,
    },
    {
      name: "Moto Elétrica Thunder 3000",
      category: "moto_eletrica",
      mainImageUrl: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80",
      galleryUrls: [],
      basePrice: 15990,
      discountPrice: null,
      showPrice: true,
      motorPower: "3000W",
      autonomy: "100-120 km",
      battery: "Lítio 72V 32Ah",
      maxSpeed: "80 km/h",
      chargeTime: "5-7 horas",
      maxWeight: "150 kg",
      availableColors: [
        { name: "Preto Fosco", value: "#333333" },
        { name: "Azul Metálico", value: "#2563eb" }
      ],
      technicalDetails: "Motor brushless de alta eficiência. Sistema de regeneração de energia. Iluminação full LED.",
      isActive: true,
    },
    {
      name: "Patinete Elétrico Urban",
      category: "autopropelido",
      mainImageUrl: "https://static.vecteezy.com/system/resources/previews/051/337/939/non_2x/isolated-electric-scooter-on-a-plain-background-showcasing-modern-design-and-features-for-urban-commuting-isolated-electric-scooter-free-png.png",
      galleryUrls: [],
      basePrice: 2490,
      discountPrice: 1990,
      showPrice: true,
      motorPower: "350W",
      autonomy: "25-30 km",
      battery: "Lítio 36V 10Ah",
      maxSpeed: "25 km/h",
      chargeTime: "3-4 horas",
      maxWeight: "100 kg",
      availableColors: [
        { name: "Preto", value: "#000000" },
        { name: "Cinza", value: "#6b7280" }
      ],
      technicalDetails: "Dobrável para fácil transporte. Pneus de 8.5 polegadas. App para smartphone.",
      isActive: true,
    },
    {
      name: "Triciclo Elétrico Cargo",
      category: "triciclo",
      mainImageUrl: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80",
      galleryUrls: [],
      basePrice: null,
      discountPrice: null,
      showPrice: false,
      motorPower: "1000W",
      autonomy: "40-50 km",
      battery: "Lítio 48V 20Ah",
      maxSpeed: "30 km/h",
      chargeTime: "5-6 horas",
      maxWeight: "200 kg (incluindo carga)",
      availableColors: [
        { name: "Branco", value: "#ffffff" },
        { name: "Azul", value: "#3b82f6" }
      ],
      technicalDetails: "Baú traseiro com capacidade de 100L. Ideal para entregas e pequenos comércios.",
      isActive: true,
    },
  ];

  for (const productData of products) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        storeId: demoStore.id,
        name: productData.name,
      },
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: {
          storeId: demoStore.id,
          ...productData,
        },
      });
      console.log("Created product:", productData.name);
    } else {
      console.log("Product already exists:", productData.name);
    }
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
