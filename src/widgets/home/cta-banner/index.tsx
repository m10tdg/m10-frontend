import { useLangStore } from '@/shared/stores/langStore'
import { translations } from '@/shared/config/i18n'
import { primary,bg } from '@/shared/styles/colors'
import { Play, ChevronRight } from 'lucide-react'

export function CtaBannerWidget() {
  
  const { lang } = useLangStore()
  const tx = translations[lang]

  return(
    <>
      <section id="cta" className="py-20 px-4" style={{ backgroundColor: bg }}>
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-3xl px-8 py-16 text-center text-white relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${primary} 0%, #7048E8 100%)`,
            }}
          >
            {/* Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 translate-x-24 -translate-y-24 bg-white" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 -translate-x-16 translate-y-16 bg-white" />

            <div className="relative">
              <h2
                className="mb-4"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontFamily: "Inter, sans-serif" }}
              >
                {tx.cta.title}
              </h2>
              <p
                className="mb-8 max-w-2xl mx-auto opacity-85"
                style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.7 }}
              >
                {tx.cta.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm transition-opacity hover:opacity-90 cursor-pointer"
                  style={{
                    backgroundColor: "#ffffff",
                    color: primary,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  <Play className="w-4 h-4" />
                  {tx.cta.cta1}
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm border border-white/40 text-white hover:bg-white/10 transition-colors cursor-pointer"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {tx.cta.cta2}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

