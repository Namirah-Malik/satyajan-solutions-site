import { existingBlogs } from '@/components/Blog/blogdata';
import { blogDetailsContent } from '@/components/Blog/blogContent';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return existingBlogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const blog = existingBlogs.find((post) => post.slug === slug);
  if (!blog) return {};
  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
    keywords: blog.metaKeywords,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const blog = existingBlogs.find((post) => post.slug === slug);
  const blogContent = blogDetailsContent.find((content) => content.id === blog?.id);
  if (!blog || !blogContent) notFound();

  return (
    <section className="min-h-screen bg-gray-50 pt-44">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Link href="/blogs" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blogs
        </Link>
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center overflow-hidden">
            {blog.featuredImage && (
              <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="p-8">
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="mb-4">
                <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">
                  {blog.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
              <div className="flex items-center gap-6 text-gray-600 flex-wrap">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(blog.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{blog.readTime}</span>
                </div>
                <span className="text-sm">By {blog.author}</span>
              </div>
            </div>
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-7 prose-p:mb-4 prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-blue-600 prose-a:hover:text-blue-700 prose-img:rounded-lg prose-img:my-8 prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:pl-4 prose-blockquote:italic"
              dangerouslySetInnerHTML={{ __html: blogContent.content }}
            />
          </div>
          <div className="bg-gray-100 p-8 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {existingBlogs.filter((post) => post.id !== blog.id && post.category === blog.category).slice(0, 2).map((relatedBlog) => (
                <Link key={relatedBlog.id} href={`/blogs/${relatedBlog.slug}`} className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {relatedBlog.featuredImage && (
                      <img src={relatedBlog.featuredImage} alt={relatedBlog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">{relatedBlog.title}</h4>
                    <p className="text-sm text-gray-600 mt-2">{relatedBlog.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>
        <div className="mt-12 text-center">
          <Link href="/blogs" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            Back to All Blogs
          </Link>
        </div>
      </div>
    </section>
  );
}