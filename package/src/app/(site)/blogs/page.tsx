import Blog from "@/components/Blog";
import React from "react";

import { blogsMetadata } from '@/lib/page-metadata';
export const metadata = blogsMetadata;

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