import PropertyCard from './Card/Card';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const Properties = async () => {
  const products = await prisma.product.findMany();

  const propertyHomes = products.map((product: any) => ({
    name: product.name,
    slug: product.id,
    location: '', // Not available in DB, fill as needed
    rate: product.price?.toString() || '',
    beds: 0,
    baths: 0,
    area: 0,
    images: Array.isArray(product.images) ? product.images.map((src: string) => ({ src })) : [],
  }));

  return (
    <section>
      <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
        <div className='mb-16 flex flex-col gap-3 '>
          <div className='flex gap-2.5 items-center justify-center'>
            <span>
              {/* Icon import left as-is */}
            </span>
            <p className='text-base font-semibold text-dark/75'>
              Properties
            </p>
          </div>
          <h2 className='text-40 lg:text-52 font-medium text-black text-center tracking-tight leading-11 mb-2'>
            Discover inspiring designed homes.
          </h2>
          <p className='text-xm font-normal text-black/50 text-center'>
            Curated homes where elegance, style, and comfort unite.
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10'>
          {propertyHomes.slice(0, 6).map((item, index) => (
            <div key={index} className=''>
              <PropertyCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Properties;
