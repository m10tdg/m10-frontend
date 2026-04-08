import { useLangStore } from '@/shared/stores/langStore'
import { translations } from '@/shared/config/i18n'
import { primary } from '@/shared/styles/colors'
import { ArrowRight, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher'

export function NavbarWidget() {
  
  const { lang } = useLangStore()
  const navigate = useNavigate()
  const tx = translations[lang]
  const [mobileOpen, setMobileOpen] = useState(false)

    return (
    <>
      <header
        className="sticky top-0 z-50 border-b border-gray-200"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: primary }}
              >
                <span className="text-white text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                  M10
                </span>
              </div>
              <div>
                <span className="text-gray-900 text-base" style={{ fontFamily: "Inter, sans-serif" }}>
                  M10 Platform
                </span>
                <p className="text-xs text-gray-400 leading-none" style={{ fontFamily: "Inter, sans-serif" }}>
                  Test Automation
                </p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { key: "features" as const, href: "#features" },
                { key: "innovation" as const, href: "#innovation" },
                { key: "tests" as const, href: "#tests" },
                { key: "pricing" as const, href: "#pricing" },
              ].map(({ key, href }) => (
                <a
                  key={key}
                  href={href}
                  className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {tx.nav[key]}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <button
                onClick={() => navigate("/login")}
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {lang === "tr" ? "Giriş Yap" : lang === "de" ? "Anmelden" : "Sign In"}
              </button>
              <button
                onClick={() => navigate("/register")}
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
              >
                {tx.nav.getStarted}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {[
              { key: "features" as const, href: "#features" },
              { key: "innovation" as const, href: "#innovation" },
              { key: "tests" as const, href: "#tests" },
              { key: "pricing" as const, href: "#pricing" },
            ].map(({ key, href }) => (
              <a
                key={key}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {tx.nav[key]}
              </a>
            ))}
            <a
              href="#cta"
              onClick={() => setMobileOpen(false)}
              className="block mt-2 px-3 py-2 rounded-lg text-sm text-white text-center"
              style={{ backgroundColor: primary }}
            >
              {tx.nav.getStarted}
            </a>
          </div>
        )}
      </header>
      </>
    )
}