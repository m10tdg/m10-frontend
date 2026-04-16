import { useLangStore } from '@/shared/stores/langStore'
import { translations } from '@/shared/config/translations/home'
import { primary,success } from '@/shared/styles/colors'
import { Sparkles, Play, ChevronRight } from 'lucide-react'


export function HeroWidget() {
  
  const { lang } = useLangStore()
  const tx = translations[lang]
  
  return (
    <>
      <section className="relative overflow-hidden py-20 sm:py-28 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
            style={{ backgroundColor: primary }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10"
            style={{ backgroundColor: success }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-6 border"
              style={{
                backgroundColor: "#EEF2FF",
                borderColor: "#C5D2FB",
                color: primary,
                fontFamily: "Inter, sans-serif",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {tx.hero.badge}
            </div>

            {/* Headline */}
            <h1
              className="mb-6"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                fontFamily: "Inter, sans-serif",
                color: "#111827",
                lineHeight: 1.15,
              }}
            >
              {tx.hero.title1}{" "}
              <span style={{ color: primary }}>{tx.hero.title2}</span>
            </h1>

            {/* Subtitle */}
            <p
              className="mb-10 text-gray-500 max-w-2xl mx-auto"
              style={{ fontSize: "1.125rem", fontFamily: "Inter, sans-serif", lineHeight: 1.7 }}
            >
              {tx.hero.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#cta"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
              >
                <Play className="w-4 h-4" />
                {tx.hero.cta1}
              </a>
              <a
                href="#innovation"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {tx.hero.cta2}
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Stats Bar */}
          <div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-gray-200"
            style={{ backgroundColor: "#E5E7EB" }}
          >
            {tx.stats.map((stat: { label: string; value: string }, idx: number) => (
              <div
                key={idx}
                className="text-center py-6 px-4"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div
                  className="mb-1"
                  style={{
                    fontSize: "1.875rem",
                    color: primary,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-sm text-gray-500"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </>
  );
}