import { useLangStore } from '@/shared/stores/langStore'
import { translations } from '@/shared/config/i18n'
import { bg, success } from '@/shared/styles/colors'
import { testTypeConfig } from './config'

export function TestTypesWidget() {

  const { lang } = useLangStore()
  const tx = translations[lang]

  return (
    <>
      <section id="tests" className="py-20 px-4" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span
              className="inline-block px-3 py-1 rounded-full text-sm mb-3 border"
              style={{
                backgroundColor: "#EBFBEE",
                borderColor: "#B2F2BB",
                color: success,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {tx.testTypes.badge}
            </span>
            <h2
              className="mb-4"
              style={{ fontSize: "2rem", color: "#111827", fontFamily: "Inter, sans-serif" }}
            >
              {tx.testTypes.title}
            </h2>
            <p
              className="text-gray-500 max-w-2xl mx-auto"
              style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.7 }}
            >
              {tx.testTypes.subtitle}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tx.testTypes.items.map(
              (item: { title: string; desc: string }, idx: number) => {
                const cfg = testTypeConfig[idx];
                const Icon = cfg.icon;
                return (
                  <div
                    key={idx}
                    className="group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all cursor-default"
                    style={{ backgroundColor: bg }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: cfg.bg }}
                      >
                        <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                      </div>
                      <div>
                        <h3
                          className="mb-1 text-gray-900"
                          style={{ fontSize: "0.9375rem", fontFamily: "Inter, sans-serif" }}
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




