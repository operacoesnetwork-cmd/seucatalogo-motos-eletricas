import { prisma } from '../lib/db';

async function main() {
  const products = await prisma.product.findMany({
    orderBy: [
      { displayOrder: 'asc' },
      { createdAt: 'desc' }
    ],
    select: {
      id: true,
      name: true,
      displayOrder: true,
      createdAt: true,
      storeId: true,
    }
  });
  
  console.log('Products in database:');
  products.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name} - displayOrder: ${p.displayOrder} - storeId: ${p.storeId}`);
  });
  
  // Check stores
  const stores = await prisma.store.findMany({
    select: { id: true, slug: true, name: true }
  });
  console.log('\nStores:');
  stores.forEach(s => console.log(`- ${s.name} (${s.slug}) - id: ${s.id}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
