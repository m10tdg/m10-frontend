import { ArrowRight, Eye, Layers3, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";

import { FooterWidget } from "@/pages/home/components/footer";
import { NavbarWidget } from "@/pages/home/components/navbar";
import { aboutHelpTranslations } from "@/shared/config/translations/aboutHelp";
import { useLangStore } from "@/shared/stores/langStore";

const principleIcons = [Layers3, Eye, UsersRound];

export function AboutPage() {
  const { lang } = useLangStore();
  const tx = aboutHelpTranslations[lang].about;

  return (
    <div className="min-h-screen bg-surface-bg font-sans">
      <NavbarWidget />
      <main>
        <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-28">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-50" />
          <div className="relative mx-auto max-w-7xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              {tx.eyebrow}
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-gray-950 sm:text-6xl">
              {tx.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">{tx.subtitle}</p>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 rounded-3xl bg-gray-950 p-8 text-white sm:p-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{tx.missionTitle}</h2>
            <p className="text-lg leading-8 text-gray-300">{tx.missionDescription}</p>
          </div>
        </section>

        <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-10 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
              {tx.principlesTitle}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {tx.principles.map((principle, index) => {
                const Icon = principleIcons[index];
                return (
                  <article
                    key={principle.title}
                    className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm"
                  >
                    <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">{principle.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-600">{principle.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl bg-blue-50 p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="text-2xl font-semibold text-gray-950">{tx.ctaTitle}</h2>
              <p className="mt-2 text-gray-600">{tx.ctaDescription}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                {tx.contact}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/help"
                className="rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-800 transition hover:bg-blue-100"
              >
                {tx.help}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <FooterWidget />
    </div>
  );
}
