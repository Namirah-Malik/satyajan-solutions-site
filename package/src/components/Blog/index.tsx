'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { blogCategories, existingBlogs as blogPosts } from './blogdata';

const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 transition-all duration-300 hover:shadow-2xl ${className}`}>
    {children}
  </div>
);


  interface BlogProps {
  initialCategory?: string;
}

const Blog = ({ initialCategory = 'all' }: BlogProps) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredBlogs = useMemo(() => {
    let filtered = blogPosts;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((b) => b.category === selectedCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [selectedCategory, searchQuery]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <main className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[40vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80&auto=format&fit=crop"
            alt="Blog hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-dark/90 via-primary/60 to-emerald-900/80" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-16 w-full">
          <span className="inline-block text-xs font-semibold text-white/70 uppercase tracking-widest px-3 py-1 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
            Satyajan Knowledge Hub
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg tracking-tight max-w-3xl">
            Power Solutions Blog
          </h1>
          <p className="text-base sm:text-xl text-white/80 max-w-2xl font-medium leading-relaxed">
            Expert insights on inverters, batteries, solar power, and energy solutions for Indian homes and businesses.
          </p>
        </div>
      </section>

      {/* ── SEARCH + FILTERS ─────────────────────────────────────────── */}
      <section className="py-8 sm:py-12 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
            <GlassCard className="p-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0 ml-1">
                <Icon icon="ph:magnifying-glass-bold" className="text-white" width={18} />
              </div>
              <input
                type="text"
                placeholder="Search by topic, keyword, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm sm:text-base text-gray-800 placeholder-gray-400 outline-none font-medium py-2 pr-3"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="mr-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Icon icon="ph:x-circle-fill" width={20} />
                </button>
              )}
            </GlassCard>
          </div>

          {/* Category filter tabs */}
          <GlassCard className="p-3 mb-6 sm:mb-8">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 snap-start ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white/60 text-gray-700 hover:bg-primary/10 hover:text-primary border border-white/40'
                }`}
              >
                All Articles
              </button>
              {blogCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 snap-start ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white/60 text-gray-700 hover:bg-primary/10 hover:text-primary border border-white/40'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Results count */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {selectedCategory === 'all' ? 'All Articles' : blogCategories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">
              {filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''} available
            </p>
          </div>

          {/* ── No results ── */}
          {filteredBlogs.length === 0 && (
            <GlassCard className="p-12 sm:p-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="ph:magnifying-glass-fill" className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2 tracking-tight">No articles found</h3>
              <p className="text-sm text-gray-500 font-medium">Try adjusting your search or filter.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-5 inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-dark transition-colors"
              >
                <Icon icon="ph:arrows-clockwise-bold" width={16} />
                Clear Filters
              </button>
            </GlassCard>
          )}

          {/* ── Uniform blog grid — ALL posts same size ── */}
          {filteredBlogs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredBlogs.map((blog) => (
                <Link key={blog.id} href={`/blogs/${blog.slug}`} className="group block h-full">
                  <GlassCard className="overflow-hidden p-0 flex flex-col h-full hover:scale-[1.02]">

                    {/* Image — fixed height on all cards */}
                    <div className="relative h-48 overflow-hidden rounded-t-3xl flex-shrink-0">
                      <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute top-3 left-3 text-xs font-bold text-white bg-primary/80 backdrop-blur-sm px-3 py-1 rounded-full capitalize">
                        {blogCategories.find(c => c.id === blog.category)?.name || blog.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-xs text-gray-400 font-medium mb-3">
                        <span className="flex items-center gap-1.5">
                          <Icon icon="ph:calendar-fill" className="text-primary" width={12} />
                          {formatDate(blog.publishedDate)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Icon icon="ph:clock-fill" className="text-primary" width={12} />
                          {blog.readTime}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-extrabold text-gray-900 mb-2 tracking-tight leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed line-clamp-3 flex-1 mb-4">
                        {blog.excerpt}
                      </p>

                      <span className="inline-flex items-center gap-1.5 text-primary font-bold text-xs sm:text-sm group-hover:gap-2.5 transition-all mt-auto">
                        Read Article
                        <Icon icon="ph:arrow-right-bold" width={14} />
                      </span>
                    </div>

                  </GlassCard>
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-12 sm:py-16 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-6 sm:p-10 bg-white/60 text-center">
            <h2 className="text-xl sm:text-3xl font-extrabold text-primary mb-3 tracking-tight">
              Need Expert Advice?
            </h2>
            <p className="text-sm sm:text-base text-dark font-medium mb-6 max-w-xl mx-auto leading-relaxed">
              Our energy experts are ready to help you choose the right solar or power backup solution for your home or business.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/918019179159"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-dark transition-colors shadow-md text-sm sm:text-base"
              >
                <Icon icon="ph:whatsapp-logo-fill" width={18} />
                Chat with an Expert
              </a>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-colors text-sm sm:text-base"
              >
                <Icon icon="ph:squares-four-fill" width={18} />
                Browse Products
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

    </main>
  );
};

export default Blog;