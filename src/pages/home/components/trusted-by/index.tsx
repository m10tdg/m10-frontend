import { useLangStore } from '@/shared/stores/langStore'
import { translations } from '@/shared/config/translations/home'
import { primary, success, warning, danger, bg } from '@/shared/styles/colors'
import { Users, TrendingUp, Shield } from 'lucide-react'

const trustedCompanies = [
  "Aselsan",
  "Havelsan",
  "Roketsan",
  "Baykar",
  "TÜBİTAK",
  "Turkcell",
  "Trendyol",
  "Getir",
];

export function TrustedByWidget() {
  
  const { lang } = useLangStore()
  const tx = translations[lang]

  return(
    <>
      <section className="py-20 px-4" style={{ backgroundColor: bg }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span
              className="inline-block px-3 py-1 rounded-full text-sm mb-3 border"
              style={{
                backgroundColor: "#FFF9DB",
                borderColor: "#FFE066",
                color: "#856404",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {tx.trusted.badge}
            </span>
            <h2
              className="mb-3"
              style={{ fontSize: "2rem", color: "#111827", fontFamily: "Inter, sans-serif" }}
            >
              {tx.trusted.title}
            </h2>
            <p
              className="text-gray-500 max-w-xl mx-auto"
              style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.7 }}
            >
              {tx.trusted.subtitle}
            </p>
          </div>

          {/* Logo Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {trustedCompanies.map((company, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center py-5 px-6 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs"
                    style={{
                      backgroundColor: [
                        primary, success, warning, danger,
                        "#7048E8", "#0C8599", "#E64980", "#20C997",
                      ][idx % 8],
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {company.slice(0, 2).toUpperCase()}
                  </div>
                  <span
                    className="text-gray-700 text-sm"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {company}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Metrics Row */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { icon: Users, label: lang === "tr" ? "Mutlu Müşteri" : lang === "de" ? "Zufriedene Kunden" : "Happy Customers", value: "500+" },
              { icon: TrendingUp, label: lang === "tr" ? "Verimlilik Artışı" : lang === "de" ? "Effizienzsteigerung" : "Efficiency Increase", value: "40%" },
              { icon: Shield, label: lang === "tr" ? "Uptime Garantisi" : lang === "de" ? "Uptime-Garantie" : "Uptime Guarantee", value: "99.9%" },
            ].map(({ icon: Icon, label, value }, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center gap-3 p-5 rounded-2xl border border-gray-200 bg-white"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#EEF2FF" }}
                >
                  <Icon className="w-5 h-5" style={{ color: primary }} />
                </div>
                <div className="text-center sm:text-left">
                  <div
                    className="text-gray-900"
                    style={{ fontSize: "1.25rem", fontFamily: "Inter, sans-serif" }}
                  >
                    {value}
                  </div>
                  <div
                    className="text-xs text-gray-500"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </>
  )
}