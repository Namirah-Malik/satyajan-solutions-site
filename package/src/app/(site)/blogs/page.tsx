import Blog from "@/components/Blog";
import React from "react";

//import { homeMetadata } from '@/lib/page-metadata'
//export const metadata = homeMetadata
import { blogsMetadata } from '@/lib/page-metadata';
export const metadata = blogsMetadata



const page = () => {
    return (
        <>
            {/* Old HeroSub removed to match the Second Website design exactly */}
            <Blog />
        </>
    );
};

export default page;