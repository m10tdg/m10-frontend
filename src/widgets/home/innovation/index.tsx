import { useLangStore } from '@/shared/stores/langStore'
import { translations } from '@/shared/config/translations/home'
import { primary, bg } from '@/shared/styles/colors'
import { innovationConfig } from './config'

export function InnovationWidget() {
  
  const { lang } = useLangStore()
  const tx = translations[lang]

  return(
    <>
      <section id="innovation" className="py-20 px-4" style={{ backgroundColor: bg }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span
              className="inline-block px-3 py-1 rounded-full text-sm mb-3 border"
              style={{
                backgroundColor: "#EEF2FF",
                borderColor: "#C5D2FB",
                color: primary,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {tx.innovation.badge}
            </span>
            <h2
              className="mb-4"
              style={{ fontSize: "2rem", color: "#111827", fontFamily: "Inter, sans-serif" }}
            >
              {tx.innovation.title}
            </h2>
            <p
              className="text-gray-500 max-w-2xl mx-auto"
              style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.7 }}
            >
              {tx.innovation.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {tx.innovation.items.map(
              (item: { title: string; desc: string }, idx: number) => {
                const cfg = innovationConfig[idx];
                const Icon = cfg.icon;
                return (
                  <div
                    key={idx}
                    className="flex gap-5 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${cfg.gradient[0]}, ${cfg.gradient[1]})`,
                      }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3
                        className="mb-2 text-gray-900"
                        style={{ fontSize: "1rem", fontFamily: "Inter, sans-serif" }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-sm text-gray-500"
                        style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.65 }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </section>
    </>
  )
}