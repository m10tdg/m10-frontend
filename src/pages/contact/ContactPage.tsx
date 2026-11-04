import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";

import { submitContactMessage } from "@/features/contact/api";
import { contactTranslations } from "@/shared/config/translations/contact";
import { useLangStore } from "@/shared/stores/langStore";
import { primary } from "@/shared/styles/colors";
import { FooterWidget } from "@/pages/home/components/footer";
import { NavbarWidget } from "@/pages/home/components/navbar";

const INITIAL_FORM = { name: "", email: "", subject: "", message: "" };

export function ContactPage() {
  const { lang } = useLangStore();
  const tx = contactTranslations[lang];
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      await submitContactMessage(form);
      setForm(INITIAL_FORM);
      setResult("success");
    } catch {
      setResult("error");
    } finally {
      setSubmitting(false);
    }
  }

  const fields = [
    { key: "name", label: tx.name, placeholder: tx.namePlaceholder, type: "text", maxLength: 120 },
    { key: "email", label: tx.email, placeholder: tx.emailPlaceholder, type: "email", maxLength: 254 },
    { key: "subject", label: tx.subject, placeholder: tx.subjectPlaceholder, type: "text", maxLength: 200 },
  ] as const;

  return (
    <div className="min-h-screen bg-surface-bg font-sans">
      <NavbarWidget />
      <main>
        <section className="relative overflow-hidden bg-white px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-50" />
          <div className="relative mx-auto max-w-7xl">
            <Link
              to="/"
              className="mb-9 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              {tx.backHome}
            </Link>
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <div className="pt-2">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  {tx.eyebrow}
                </p>
                <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-gray-950 sm:text-5xl">
                  {tx.title}
                </h1>
                <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">{tx.subtitle}</p>

                <div className="mt-10 space-y-5">
                  <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <Mail className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="font-medium text-gray-900">{tx.contactTitle}</h2>
                      <p className="mt-1 text-sm leading-6 text-gray-600">{tx.contactDescription}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                      <MessageSquareText className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="font-medium text-gray-900">{tx.responseTitle}</h2>
                      <p className="mt-1 text-sm leading-6 text-gray-600">{tx.responseDescription}</p>
                    </div>
                  </div>
                </div>
              </div>

              <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-900/5 sm:p-9">
                <h2 className="text-xl font-semibold text-gray-900">{tx.formTitle}</h2>
                <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
                  {fields.map(({ key, label, placeholder, type, maxLength }) => (
                    <div key={key}>
                      <label htmlFor={key} className="mb-2 block text-sm font-medium text-gray-700">
                        {label}
                      </label>
                      <input
                        id={key}
                        type={type}
                        required
                        maxLength={maxLength}
                        autoComplete={key === "name" ? "name" : key === "email" ? "email" : "off"}
                        value={form[key]}
                        onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                        placeholder={placeholder}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                      {tx.message}
                    </label>
                    <textarea
                      id="message"
                      required
                      maxLength={5000}
                      rows={5}
                      value={form.message}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, message: event.target.value }))
                      }
                      placeholder={tx.messagePlaceholder}
                      className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                  {result && (
                    <div
                      role={result === "success" ? "status" : "alert"}
                      className={`rounded-xl px-4 py-3 text-sm ${
                        result === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {result === "success" ? tx.success : tx.failure}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 hover:cursor-pointer"
                    style={{ backgroundColor: primary }}
                  >
                    {submitting ? tx.sending : tx.send}
                    {result !== "success" && <ArrowRight className="h-4 w-4" />}
                    {result === "success" && <CheckCircle2 className="h-4 w-4" />}
                  </button>
                </form>
              </section>
            </div>
          </div>
        </section>
      </main>
      <FooterWidget />
    </div>
  );
}
