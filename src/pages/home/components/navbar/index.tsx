import { useLangStore } from '@/shared/stores/langStore'
import { translations } from '@/shared/config/translations/home'
import { primary } from '@/shared/styles/colors'
import { ArrowRight,Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher'
import { blogTranslations } from '@/shared/config/translations/blog'

export function NavbarWidget() {
  
  const { lang } = useLangStore()
  const navigate = useNavigate()
  const location = useLocation()
  const tx = translations[lang]
  const blogTx = blogTranslations[lang]
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) return

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "smooth" })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [location.hash, location.pathname])

    return (
    <>
      <header
        className="sticky top-0 z-50 border-b border-gray-200"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              aria-label="M10 Platform home"
              className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
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
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { key: "features" as const, section: "features" },
                { key: "innovation" as const, section: "innovation" },
                { key: "tests" as const, section: "tests" },
                { key: "pricing" as const, section: "pricing" },
              ].map(({ key, section }) => (
                <Link
                  key={key}
                  to={`/#${section}`}
                  className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {tx.nav[key]}
                </Link>
              ))}
              <button
                onClick={() => navigate("/blog")}
                className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {blogTx.nav}
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {lang === "tr" ? "İletişim" : lang === "de" ? "Kontakt" : "Contact"}
              </button>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <button
                onClick={() => navigate("/login")}
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {lang === "tr" ? "Giriş Yap" : lang === "de" ? "Anmelden" : "Sign In"}
              </button>
              <button
                onClick={() => navigate("/register")}
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white transition-opacity hover:opacity-90 cursor-pointer"
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
              { key: "features" as const, section: "features" },
              { key: "innovation" as const, section: "innovation" },
              { key: "tests" as const, section: "tests" },
              { key: "pricing" as const, section: "pricing" },
            ].map(({ key, section }) => (
              <Link
                key={key}
                to={`/#${section}`}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {tx.nav[key]}
              </Link>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false)
                navigate("/blog")
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {blogTx.nav}
            </button>
            <button
              onClick={() => {
                setMobileOpen(false)
                navigate("/contact")
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {lang === "tr" ? "İletişim" : lang === "de" ? "Kontakt" : "Contact"}
            </button>
            <Link
              to="/#cta"
              onClick={() => setMobileOpen(false)}
              className="block mt-2 px-3 py-2 rounded-lg text-sm text-white text-center"
              style={{ backgroundColor: primary }}
            >
              {tx.nav.getStarted}
            </Link>
          </div>
        )}
      </header>
      </>
    )
}