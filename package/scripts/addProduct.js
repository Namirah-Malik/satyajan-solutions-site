import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.create({
    data: {
      name: "Test Product",
      description: "A sample product added via script.",
      price: 99.99,
      images: ["/images/product1.jpg", "/images/product1b.jpg"],
      salient_features: ["Waterproof", "Lightweight", "Eco-friendly"],
      features: ["High Quality", "Durable", "Easy to use"],
      specifications: ["5 Year Warranty", "Energy Efficient", "Easy Installation"]
    }
  });
  console.log('Product added:', product);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect()); 