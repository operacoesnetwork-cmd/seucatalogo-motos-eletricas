const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Store" ADD COLUMN "metaPixelId" VARCHAR(50);`)
    await prisma.$executeRawUnsafe(`ALTER TABLE "Store" ADD COLUMN "googleAdsId" VARCHAR(50);`)
    console.log("Columns added successfully")
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
