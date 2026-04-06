import { useLangStore } from '@/shared/stores/langStore'
import { translations } from '@/shared/config/i18n'
import { primary } from '@/shared/styles/colors'
import { featureConfig } from './config'

export function FeaturesWidget() {

  const { lang } = useLangStore()
  const tx = translations[lang]


    return (
    <>
      <section id="features" className="py-20 px-4" style={{ backgroundColor: "#ffffff" }}>
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
              {tx.features.badge}
            </span>
            <h2
              className="mb-4"
              style={{ fontSize: "2rem", color: "#111827", fontFamily: "Inter, sans-serif" }}
            >
              {tx.features.title}
            </h2>
            <p
              className="text-gray-500 max-w-2xl mx-auto"
              style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.7 }}
            >
              {tx.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tx.features.items.map(
              (item: { title: string; desc: string }, idx: number) => {
                const cfg = featureConfig[idx];
                const Icon = cfg.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: cfg.bg }}
                    >
                      <Icon className="w-6 h-6" style={{ color: cfg.color }} />
                    </div>
                    <h3
                      className="mb-2 text-gray-900"
                      style={{ fontSize: "1rem", fontFamily: "Inter, sans-serif" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm text-gray-500"
                      style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}
                    >
                      {item.desc}
                    </p>
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