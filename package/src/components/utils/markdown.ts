import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import markdownToHtml from './markdownToHtml';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage: string;
  author: string;
  authorImage: string;
  detail: string;
  tag: string;
  content: string;
}

const postsDirectory = path.join(process.cwd(), 'markdown/blogs');

export function getAllBlogPosts(): BlogPost[] {
  // Get file names under /markdown/blogs
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      // Remove ".mdx" from file name to get slug
      const slug = fileName.replace(/\.mdx$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      return {
        slug,
        ...(matterResult.data as Omit<BlogPost, 'slug' | 'content'>),
        content: matterResult.content,
      };
    });

  // Sort posts by date
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    return {
      slug,
      ...(matterResult.data as Omit<BlogPost, 'slug' | 'content'>),
      content: matterResult.content,
    };
  } catch (error) {
    return null;
  }
}

export async function getBlogPostBySlugWithHtml(slug: string): Promise<(BlogPost & { htmlContent: string }) | null> {
  const post = getBlogPostBySlug(slug);
  if (!post) return null;

  const htmlContent = await markdownToHtml(post.content);
  return {
    ...post,
    htmlContent,
  };
}
