import Blog from "@/components/Blog";
import React from "react";

import { blogMetadata } from '@/lib/page-metadata';
export const metadata = blogMetadata;

interface PageProps {
  searchParams: { category?: string };
}

const page = ({ searchParams }: PageProps) => {
  const category = searchParams?.category ?? 'all';
  return (
    <>
      <Blog initialCategory={category} />
    </>
  );
};

export default page;