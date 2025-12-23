import { PrismaClient } from '@prisma/client';
import { getPublicUrl } from '../lib/s3';

const prisma = new PrismaClient();

function extractKeyFromUrl(url: string): string | null {
  try {
    // Extract key from signed URL or regular S3 URL
    // Examples:
    // https://bucket.s3.region.amazonaws.com/key?signature=...
    // https://bucket.s3.amazonaws.com/key
    
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Remove leading slash
    let key = pathname.startsWith('/') ? pathname.substring(1) : pathname;
    
    // If key doesn't include 'uploads/', it might be just the filename
    // In that case, we can't reliably extract it
    if (!key.includes('uploads/')) {
      console.warn(`Warning: Could not extract key from URL: ${url}`);
      return null;
    }
    
    return key;
  } catch (error) {
    console.error(`Error extracting key from URL: ${url}`, error);
    return null;
  }
}

function generatePublicUrl(key: string): string {
  // If key already has public/uploads, use as-is
  if (key.includes('public/uploads')) {
    return getPublicUrl(key);
  }
  
  // If key has uploads/ but not public/, add public/ prefix
  if (key.includes('uploads/')) {
    const newKey = key.replace('uploads/', 'public/uploads/');
    return getPublicUrl(newKey);
  }
  
  // Otherwise, assume it needs public/uploads/ prefix
  const newKey = `public/uploads/${key}`;
  return getPublicUrl(newKey);
}

async function migrateImageUrls() {
  console.log('Starting image URL migration...');
  
  try {
    // Migrate Store images (logo and banner)
    const stores = await prisma.store.findMany();
    console.log(`Found ${stores.length} stores to check`);
    
    for (const store of stores) {
      const updates: any = {};
      
      if (store.logoUrl) {
        const key = extractKeyFromUrl(store.logoUrl);
        if (key) {
          updates.logoUrl = generatePublicUrl(key);
        }
      }
      
      if (store.bannerUrl) {
        const key = extractKeyFromUrl(store.bannerUrl);
        if (key) {
          updates.bannerUrl = generatePublicUrl(key);
        }
      }
      
      if (Object.keys(updates).length > 0) {
        await prisma.store.update({
          where: { id: store.id },
          data: updates,
        });
        console.log(`Updated store ${store.id}: ${Object.keys(updates).join(', ')}`);
      }
    }
    
    // Migrate Product images (main image and gallery)
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products to check`);
    
    for (const product of products) {
      const updates: any = {};
      
      // Update main image
      if (product.mainImageUrl) {
        const key = extractKeyFromUrl(product.mainImageUrl);
        if (key) {
          updates.mainImageUrl = generatePublicUrl(key);
        }
      }
      
      // Update gallery images
      if (product.galleryUrls && product.galleryUrls.length > 0) {
        const newGalleryUrls: string[] = [];
        for (const url of product.galleryUrls) {
          const key = extractKeyFromUrl(url);
          if (key) {
            newGalleryUrls.push(generatePublicUrl(key));
          } else {
            newGalleryUrls.push(url); // Keep original if can't extract
          }
        }
        updates.galleryUrls = newGalleryUrls;
      }
      
      if (Object.keys(updates).length > 0) {
        await prisma.product.update({
          where: { id: product.id },
          data: updates,
        });
        console.log(`Updated product ${product.id}: ${product.name}`);
      }
    }
    
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateImageUrls()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
