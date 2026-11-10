import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Clock3 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import type { BlogPost, BlogPostSummary } from "@/entities/blog";
import { getPublishedBlog, listPublishedBlogs } from "@/features/blog/api";
import { getApiErrorStatus } from "@/shared/lib/apiError";
import { blogTranslations } from "@/shared/config/translations/blog";
import { useLangStore } from "@/shared/stores/langStore";
import { FooterWidget } from "@/pages/home/components/footer";
import { NavbarWidget } from "@/pages/home/components/navbar";

function formatDate(value: string, lang: string) {
  const locale = lang === "tr" ? "tr-TR" : lang === "de" ? "de-DE" : "en-US";
  return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(value));
}

export function BlogPage() {
  const { lang } = useLangStore();
  const tx = blogTranslations[lang];
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    listPublishedBlogs()
      .then((items) => {
        if (active) setPosts(items);
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface-bg font-sans">
      <NavbarWidget />
      <main className="min-h-[60vh] bg-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              M10
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
              {tx.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-gray-600">{tx.subtitle}</p>
          </div>

          {failed ? (
            <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {blogTranslations[lang].owner.requestFailed}
            </p>
          ) : !loading && posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-4 text-sm text-gray-500">{tx.empty}</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <time dateTime={post.published_at} className="text-sm text-gray-500">
                    {formatDate(post.published_at, lang)}
                  </time>
                  <h2 className="mt-4 text-xl font-semibold leading-7 text-gray-900">{post.title}</h2>
                  <p className="mt-3 flex-1 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                    {post.excerpt}
                  </p>
                  <Link
                    to={`/blog/${encodeURIComponent(post.slug)}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                  >
                    {tx.readMore}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <FooterWidget />
    </div>
  );
}

export function BlogPostPage() {
  const { slug = "" } = useParams();
  const { lang } = useLangStore();
  const tx = blogTranslations[lang];
  const [result, setResult] = useState<{
    slug: string;
    post: BlogPost | null;
    notFound: boolean;
    failed: boolean;
  } | null>(null);
  const loading = result?.slug !== slug;
  const post = result?.slug === slug ? result.post : null;
  const notFound = result?.slug === slug && result.notFound;
  const failed = result?.slug === slug && result.failed;

  useEffect(() => {
    let active = true;
    getPublishedBlog(slug)
      .then((item) => {
        if (active) setResult({ slug, post: item, notFound: false, failed: false });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setResult({
          slug,
          post: null,
          notFound: getApiErrorStatus(error) === 404,
          failed: getApiErrorStatus(error) !== 404,
        });
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const readingMinutes = post
    ? Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 200))
    : 0;

  return (
    <div className="min-h-screen bg-surface-bg font-sans">
      <NavbarWidget />
      <main className="min-h-[60vh] bg-white px-4 py-12 sm:px-6 sm:py-20">
        <article className="mx-auto max-w-3xl">
          <Link
            to="/blog"
            className="mb-10 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            {tx.back}
          </Link>
          {loading ? (
            <p className="text-sm text-gray-500" role="status">{tx.title}...</p>
          ) : failed ? (
            <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {tx.owner.requestFailed}
            </p>
          ) : notFound || !post ? (
            <p role="status" className="rounded-xl bg-gray-50 p-6 text-gray-600">{tx.notFound}</p>
          ) : (
            <>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">M10 Blog</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-gray-950 sm:text-5xl">
                {post.title}
              </h1>
              <p className="mt-5 text-xl leading-8 text-gray-600">{post.excerpt}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-gray-100 pb-6 text-sm text-gray-500">
                <time dateTime={post.published_at ?? post.created_at}>
                  {formatDate(post.published_at ?? post.created_at, lang)}
                </time>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4" />
                  {readingMinutes} {tx.readingTime}
                </span>
              </div>
              <div className="mt-8 whitespace-pre-wrap break-words text-base leading-8 text-gray-700">
                {post.content}
              </div>
            </>
          )}
        </article>
      </main>
      <FooterWidget />
    </div>
  );
}
