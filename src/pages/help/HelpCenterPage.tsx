import { ArrowRight, BookOpenCheck, CircleHelp } from "lucide-react";
import { Link } from "react-router-dom";

import { FooterWidget } from "@/pages/home/components/footer";
import { NavbarWidget } from "@/pages/home/components/navbar";
import { aboutHelpTranslations } from "@/shared/config/translations/aboutHelp";
import { useLangStore } from "@/shared/stores/langStore";

export function HelpCenterPage() {
  const { lang } = useLangStore();
  const tx = aboutHelpTranslations[lang].help;

  return (
    <div className="min-h-screen bg-surface-bg font-sans">
      <NavbarWidget />
      <main>
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                {tx.eyebrow}
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
                {tx.title}
              </h1>
              <p className="mt-5 text-lg leading-8 text-gray-600">{tx.subtitle}</p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <aside className="h-fit rounded-2xl border border-blue-100 bg-blue-50 p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-700">
                  <BookOpenCheck className="h-6 w-6" />
                </span>
                <h2 className="mt-5 text-xl font-semibold text-gray-950">{tx.gettingStarted}</h2>
                <p className="mt-3 text-sm leading-6 text-gray-700">{tx.gettingStartedDescription}</p>
              </aside>

              <section>
                <h2 className="mb-5 text-2xl font-semibold text-gray-950">{tx.questionsTitle}</h2>
                <div className="space-y-3">
                  {tx.questions.map((item) => (
                    <details
                      key={item.question}
                      className="group rounded-2xl border border-gray-200 bg-white p-5 open:shadow-sm"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-gray-900">
                        {item.question}
                        <CircleHelp className="h-5 w-5 shrink-0 text-blue-600 transition-transform group-open:rotate-12" />
                      </summary>
                      <p className="mt-4 pr-8 text-sm leading-6 text-gray-600">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            </div>

            <section className="mt-12 flex flex-col justify-between gap-6 rounded-3xl bg-gray-950 p-8 text-white sm:flex-row sm:items-center sm:p-10">
              <div>
                <h2 className="text-2xl font-semibold">{tx.stillNeedHelp}</h2>
                <p className="mt-2 max-w-2xl leading-7 text-gray-300">{tx.contactDescription}</p>
              </div>
              <Link
                to="/contact"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                {tx.contact}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>

            <div className="mt-8 text-center">
              <Link to="/about" className="text-sm font-medium text-blue-700 hover:text-blue-900">
                {tx.about}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <FooterWidget />
    </div>
  );
}
