export type BlogStatus = "draft" | "published";

export interface BlogPostPayload {
  title: string;
  excerpt: string;
  content: string;
}

export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  created_at: string;
}

export interface BlogPost extends BlogPostPayload {
  id: string;
  slug: string;
  status: BlogStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
