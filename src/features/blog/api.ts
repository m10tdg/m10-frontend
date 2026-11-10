import { backendServiceApi } from "@/shared/lib/api";
import type { BlogPost, BlogPostSummary } from "@/entities/blog";

export async function listPublishedBlogs(): Promise<BlogPostSummary[]> {
  const response = await backendServiceApi.get<{ items: BlogPostSummary[] }>("/blogs");
  return response.data.items;
}

export async function getPublishedBlog(slug: string): Promise<BlogPost> {
  const response = await backendServiceApi.get<{ post: BlogPost }>(`/blogs/${encodeURIComponent(slug)}`);
  return response.data.post;
}
