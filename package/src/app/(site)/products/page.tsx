// 👋 No 'use client' here! This is a Server Component.

import HeroSub from "@/components/shared/HeroSub";
import { productsMetadata } from '@/lib/page-metadata';
import ProductsClient from "./ProductsClient"; // Import the client component

// ✅ Now you can export metadata correctly
export const metadata = productsMetadata;

const Page = () => {
    return (
        <>
            <HeroSub
                title="Discover Our Products."
                description="Explore our exclusive range of products, crafted to deliver quality, innovation, and satisfaction for every need."
                badge="Products"
            />
            {/* Render the client component */}
            <ProductsClient />
        </>
    );
};

export default Page;