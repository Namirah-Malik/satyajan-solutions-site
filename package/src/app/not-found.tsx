import Link from "next/link";
import { Metadata } from "next";
import { Icon } from "@iconify/react/dist/iconify.js";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you’re looking for could not be found.",
};

const ErrorPage = () => {
  return (
    <main className="min-h-screen page-pt pb-20 bg-soft-primary">
      <div className="site-container">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6 py-10 sm:py-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-primary/20 shadow-soft text-xs sm:text-sm font-semibold text-primary uppercase tracking-[0.18em]">
            <Icon icon="ph:warning-fill" width={14} />
            Error 404
          </span>

          <h1 className="display-1 text-balance">
            We couldn&apos;t find that page.
          </h1>

          <p className="text-base sm:text-lg text-muted max-w-xl">
            The page you&apos;re looking for may have been moved, deleted, or never existed. Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            <Link href="/" className="btn btn-primary btn-lg">
              <Icon icon="ph:house-fill" width={16} />
              Back to home
            </Link>
            <Link href="/products" className="btn btn-outline btn-lg">
              Browse products
              <Icon icon="ph:arrow-right-bold" width={14} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
