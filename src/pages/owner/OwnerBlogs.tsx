import { useState, type FormEvent } from "react";
import { FileText, Pencil, Plus, Send, Undo2 } from "lucide-react";

import type { BlogPost, BlogPostPayload, BlogStatus } from "@/entities/blog";
import { listOwnerBlogs, saveOwnerBlog, setBlogPublished } from "@/features/owner/api";
import { blogTranslations } from "@/shared/config/translations/blog";
import { ownerTranslations } from "@/shared/config/translations/owner";
import { useLangStore } from "@/shared/stores/langStore";
import { Notice } from "@/pages/owner/components/Notice";
import { RefreshButton } from "@/pages/owner/components/RefreshButton";
import { useOwnerResource } from "@/pages/owner/useOwnerResource";

const NO_POSTS: BlogPost[] = [];
const EMPTY_FORM: BlogPostPayload = { title: "", excerpt: "", content: "" };

export function OwnerBlogsPage() {
  const { lang } = useLangStore();
  const ownerTx = ownerTranslations[lang];
  const tx = blogTranslations[lang].owner;
  const { data: posts, loading, failed, reload } = useOwnerResource(listOwnerBlogs, NO_POSTS);
  const [form, setForm] = useState<BlogPostPayload>(EMPTY_FORM);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  function startNewPost() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
    setError(false);
    setNotice(null);
  }

  function startEditing(post: BlogPost) {
    setEditing(post);
    setForm({ title: post.title, excerpt: post.excerpt, content: post.content });
    setFormOpen(true);
    setError(false);
    setNotice(null);
  }

  async function savePost(status: BlogStatus) {
    setSaving(true);
    setError(false);
    setNotice(null);
    try {
      const saved = await saveOwnerBlog({ ...form, status }, editing?.id);
      if (editing && saved.status !== status) {
        await setBlogPublished(saved.id, status === "published");
      }
      setFormOpen(false);
      setEditing(null);
      setForm(EMPTY_FORM);
      setNotice(status === "published" ? tx.publishedNotice : tx.saved);
      await reload();
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(post: BlogPost) {
    setPendingId(post.id);
    setError(false);
    setNotice(null);
    try {
      await setBlogPublished(post.id, post.status !== "published");
      setNotice(post.status === "published" ? tx.unpublishedNotice : tx.publishedNotice);
      await reload();
    } catch {
      setError(true);
    } finally {
      setPendingId(null);
    }
  }

  const dateLocale = lang === "tr" ? "tr-TR" : lang === "de" ? "de-DE" : "en-US";

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{tx.title}</h1>
          <p className="text-sm text-gray-500">{tx.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <RefreshButton label={ownerTx.refresh} loading={loading} onClick={reload} />
          <button
            type="button"
            onClick={startNewPost}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            {tx.newPost}
          </button>
        </div>
      </div>

      {notice && <Notice kind="success" className="mb-5">{notice}</Notice>}
      {error && <Notice kind="error" className="mb-5">{tx.requestFailed}</Notice>}

      <div className={`grid items-start gap-6 ${formOpen ? "xl:grid-cols-[minmax(320px,0.8fr)_1.2fr]" : ""}`}>
        {formOpen && (
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-base font-medium text-gray-900">
                {editing ? tx.editPost : tx.newPost}
              </h2>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                {tx.cancel}
              </button>
            </div>
            <form
              className="space-y-4"
              onSubmit={(event: FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                void savePost(editing?.status ?? "draft");
              }}
            >
              <div>
                <label htmlFor="blog-title" className="mb-1.5 block text-sm font-medium text-gray-700">
                  {tx.titleLabel}
                </label>
                <input
                  id="blog-title"
                  required
                  maxLength={200}
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder={tx.titlePlaceholder}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <div>
                <label htmlFor="blog-excerpt" className="mb-1.5 block text-sm font-medium text-gray-700">
                  {tx.excerpt}
                </label>
                <textarea
                  id="blog-excerpt"
                  required
                  maxLength={500}
                  rows={3}
                  value={form.excerpt}
                  onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))}
                  placeholder={tx.excerptPlaceholder}
                  className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <div>
                <label htmlFor="blog-content" className="mb-1.5 block text-sm font-medium text-gray-700">
                  {tx.content}
                </label>
                <textarea
                  id="blog-content"
                  required
                  maxLength={50000}
                  rows={12}
                  value={form.content}
                  onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                  placeholder={tx.contentPlaceholder}
                  className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <FileText className="h-4 w-4" />
                  {editing ? tx.saveChanges : tx.saveDraft}
                </button>
                {(!editing || editing.status !== "published") && (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={(event) => {
                      const formElement = event.currentTarget.form;
                      if (formElement?.reportValidity()) {
                        void savePost("published");
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    {tx.publish}
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        <section className="min-w-0 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-medium text-gray-900">
              {tx.posts} <span className="text-gray-400">({posts.length})</span>
            </h2>
          </div>
          {failed ? (
            <div className="p-5">
              <Notice kind="error">{ownerTx.errors.requestFailed}</Notice>
            </div>
          ) : posts.length === 0 && !loading ? (
            <div className="px-6 py-14 text-center">
              <FileText className="mx-auto h-9 w-9 text-gray-400" />
              <p className="mt-3 text-sm text-gray-500">{tx.empty}</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {posts.map((post) => (
                <li key={post.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="break-words font-medium text-gray-900">{post.title}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        post.status === "published" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {post.status === "published" ? tx.published : tx.draft}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">{post.excerpt}</p>
                    <p className="mt-2 text-xs text-gray-400">
                      {new Intl.DateTimeFormat(dateLocale, { dateStyle: "medium" }).format(
                        new Date(post.updated_at),
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(post)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Pencil className="h-4 w-4" />
                      {tx.edit}
                    </button>
                    <button
                      type="button"
                      disabled={pendingId !== null}
                      onClick={() => togglePublished(post)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      {post.status === "published" ? <Undo2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                      {post.status === "published" ? tx.unpublish : tx.publish}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
