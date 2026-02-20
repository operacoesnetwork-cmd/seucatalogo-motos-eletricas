const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Adding metaPixelId column...');
        await prisma.$executeRawUnsafe(`ALTER TABLE "Store" ADD COLUMN "metaPixelId" VARCHAR(100);`);
        console.log('Success for metaPixelId');
    } catch (e) {
        console.log('Could not add metaPixelId (may already exist):', e.message);
    }

    try {
        console.log('Adding googleAdsId column...');
        await prisma.$executeRawUnsafe(`ALTER TABLE "Store" ADD COLUMN "googleAdsId" VARCHAR(100);`);
        console.log('Success for googleAdsId');
    } catch (e) {
        console.log('Could not add googleAdsId (may already exist):', e.message);
    }
}

main()
    .catch((e) => {
        console.error('Unexpected error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
