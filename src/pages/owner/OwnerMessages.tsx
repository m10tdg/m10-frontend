import { useState, type FormEvent } from "react";
import { Check, Inbox, Mail, MailOpen, Send } from "lucide-react";

import { listMessages, replyToMessage, updateMessageReadStatus } from "@/features/owner/api";
import { ownerTranslations } from "@/shared/config/translations/owner";
import { useLangStore } from "@/shared/stores/langStore";
import type { ContactMessage } from "@/entities/contact";
import { Notice } from "@/pages/owner/components/Notice";
import { RefreshButton } from "@/pages/owner/components/RefreshButton";
import { useOwnerResource } from "@/pages/owner/useOwnerResource";

const NO_MESSAGES: ContactMessage[] = [];

export function OwnerMessagesPage() {
  const { lang } = useLangStore();
  const tx = ownerTranslations[lang];
  const { data: messages, loading, failed, reload } = useOwnerResource(listMessages, NO_MESSAGES);
  const dateLocale = lang === "tr" ? "tr-TR" : lang === "de" ? "de-DE" : "en-US";
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [replySentFor, setReplySentFor] = useState<string | null>(null);

  async function toggleRead(message: ContactMessage) {
    setPendingAction(`${message.id}:read`);
    setActionError(null);
    setReplySentFor(null);
    try {
      await updateMessageReadStatus(message.id, !message.is_read);
      await reload();
    } catch {
      setActionError(message.id);
    } finally {
      setPendingAction(null);
    }
  }

  async function sendReply(event: FormEvent<HTMLFormElement>, message: ContactMessage) {
    event.preventDefault();
    const reply = replyDrafts[message.id]?.trim();
    if (!reply) return;

    setPendingAction(`${message.id}:reply`);
    setActionError(null);
    setReplySentFor(null);
    try {
      await replyToMessage(message.id, reply);
      setReplyDrafts((drafts) => ({ ...drafts, [message.id]: "" }));
      setReplySentFor(message.id);
      await reload();
    } catch {
      setActionError(message.id);
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{tx.messages.title}</h1>
          <p className="text-sm text-gray-500">{tx.messages.subtitle}</p>
        </div>
        <RefreshButton label={tx.refresh} loading={loading} onClick={reload} />
      </div>

      {failed ? (
        <Notice kind="error">{tx.errors.requestFailed}</Notice>
      ) : messages.length === 0 && !loading ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <Inbox className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-4 text-sm text-gray-500">{tx.messages.empty}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm sm:p-6 ${
                message.is_read ? "border-gray-200" : "border-blue-200 ring-1 ring-blue-100"
              }`}
            >
              <div className="flex flex-col justify-between gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="break-words text-base font-semibold text-gray-900">{message.subject}</h2>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        message.is_read ? "bg-gray-100 text-gray-600" : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {message.is_read ? tx.messages.read : tx.messages.unread}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {tx.messages.from}{" "}
                    <span className="font-medium text-gray-700">{message.name}</span>
                    {" · "}
                    <a
                      href={`mailto:${message.email}`}
                      className="break-all text-blue-600 hover:text-blue-700"
                    >
                      {message.email}
                    </a>
                  </p>
                </div>
                <time
                  dateTime={message.created_at}
                  className="shrink-0 text-xs text-gray-500"
                >
                  {tx.messages.received}:{" "}
                  {new Intl.DateTimeFormat(dateLocale, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(message.created_at))}
                </time>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-gray-500">
                  {message.is_read ? tx.messages.read : tx.messages.unread}
                  {message.responded_at && ` · ${tx.messages.replied}`}
                </p>
                <button
                  type="button"
                  disabled={pendingAction !== null}
                  onClick={() => toggleRead(message)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  {message.is_read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  {message.is_read ? tx.messages.markUnread : tx.messages.markRead}
                </button>
              </div>
              <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                {message.message}
              </p>
              {message.reply_text && (
                <div className="mt-5 rounded-xl border border-green-100 bg-green-50/60 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-green-800">
                    <Check className="h-4 w-4" />
                    {tx.messages.replied}
                    {message.responded_at && (
                      <time dateTime={message.responded_at} className="font-normal text-green-700">
                        ·{" "}
                        {new Intl.DateTimeFormat(dateLocale, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(message.responded_at))}
                      </time>
                    )}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                    {message.reply_text}
                  </p>
                </div>
              )}
              <form className="mt-5 border-t border-gray-100 pt-5" onSubmit={(event) => sendReply(event, message)}>
                <label
                  htmlFor={`reply-${message.id}`}
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  {tx.messages.reply}
                </label>
                <textarea
                  id={`reply-${message.id}`}
                  rows={3}
                  maxLength={5000}
                  required
                  value={replyDrafts[message.id] ?? ""}
                  onChange={(event) =>
                    setReplyDrafts((drafts) => ({ ...drafts, [message.id]: event.target.value }))
                  }
                  placeholder={tx.messages.replyPlaceholder}
                  className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  {actionError === message.id ? (
                    <p role="alert" className="text-sm text-red-600">{tx.messages.actionFailed}</p>
                  ) : replySentFor === message.id ? (
                    <p role="status" className="text-sm text-green-700">{tx.messages.replySent}</p>
                  ) : (
                    <span />
                  )}
                  <button
                    type="submit"
                    disabled={pendingAction !== null || !replyDrafts[message.id]?.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    {pendingAction === `${message.id}:reply`
                      ? tx.messages.sendingReply
                      : tx.messages.sendReply}
                  </button>
                </div>
              </form>
            </article>
          ))}
          {loading && <p className="py-2 text-center text-sm text-gray-500">{tx.refresh}…</p>}
        </div>
      )}
    </>
  );
}
