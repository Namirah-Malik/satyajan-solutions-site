import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test basic connection
    const productCount = await prisma.product.count();
    
    // Test fetching one product with minimal fields
    const testProduct = await prisma.product.findFirst({
      select: {
        id: true,
        name: true,
        price: true,
      }
    });
    
    return NextResponse.json({
      success: true,
      productCount,
      testProduct,
      message: 'Database connection is working'
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      message: 'Database connection failed'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 