import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateData() {
  try {
    console.log('Starting data migration...');
    
    // Get all products
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products to migrate`);
    
    for (const product of products) {
      console.log(`Migrating product: ${product.name}`);
      
      // Initialize empty arrays for new fields if they don't exist
      const updateData = {
        salient_features: [],
        features: [],
        specifications: []
      };
      
      // If the product has old data structure, try to extract information
      if (product.data && Array.isArray(product.data)) {
        // Extract specifications from old data structure
        const specs = [];
        product.data.forEach(item => {
          if (item && typeof item === 'object' && 'labal' in item && 'value' in item) {
            specs.push(`${item.labal}: ${item.value}`);
          }
        });
        updateData.specifications = specs;
      }
      
      // Update the product
      await prisma.product.update({
        where: { id: product.id },
        data: updateData
      });
      
      console.log(`✓ Migrated product: ${product.name}`);
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData(); 