import { useLangStore } from '@/shared/stores/langStore'
import { translations } from '@/shared/config/i18n'
import { primary, success } from '@/shared/styles/colors'
import { langLabels } from '@/shared/config/i18n'
import type { Lang } from '@/shared/stores/types'


export function FooterWidget() {
  
  const { lang,setLang } = useLangStore()
  const tx = translations[lang]

  return (
    <>
      <footer className="py-16 px-4" style={{ backgroundColor: "#111827" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: primary }}
                >
                  <span className="text-white text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                    M10
                  </span>
                </div>
                <span
                  className="text-white"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  M10 Platform
                </span>
              </div>
              <p
                className="text-sm text-gray-400"
                style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.65 }}
              >
                {tx.footer.tagline}
              </p>

              {/* Language switcher in footer */}
              <div className="mt-5">
                <div className="flex gap-2">
                  {(Object.keys(langLabels) as Lang[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className="px-3 py-1.5 rounded-lg text-xs border transition-colors cursor-pointer"
                      style={{
                        backgroundColor: lang === l ? primary : "transparent",
                        borderColor: lang === l ? primary : "#374151",
                        color: lang === l ? "#ffffff" : "#9CA3AF",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {langLabels[l]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Links */}
            {(["product", "company", "support"] as const).map((section) => (
              <div key={section}>
                <h4
                  className="text-white mb-4 text-sm"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {tx.footer[section]}
                </h4>
                <ul className="space-y-2.5">
                  {tx.footer.links[section].map((link: string, i: number) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <p
              className="text-sm text-gray-500"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {tx.footer.rights}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: success }} />
              {lang === "tr" ? "Tüm sistemler çalışıyor" : lang === "de" ? "Alle Systeme laufen" : "All systems operational"}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}