// components/Breadcrumb.tsx
// Renders accessible breadcrumbs with proper aria-label.
// Schema is injected by the parent page (product page already includes BreadcrumbList schema).

import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href:  string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-xs sm:text-sm text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1">
              {index > 0 && (
                <span aria-hidden="true" className="text-gray-400">/</span>
              )}
              {isLast ? (
                <span
                  className="text-gray-700 font-medium line-clamp-1 max-w-[200px]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}