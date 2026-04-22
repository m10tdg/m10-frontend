import { useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher";
import { primary, bg } from "@/shared/styles/colors";

interface AuthLayoutProps {
  children: React.ReactNode;
  footerLinks: string[];
}

export function AuthLayout({ children, footerLinks }: AuthLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bg, fontFamily: "Inter, sans-serif" }}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
        >
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
                <p className="text-xs text-start text-gray-400 leading-none" style={{ fontFamily: "Inter, sans-serif" }}>
                  Test Automation
                </p>
              </div>
            </div>
        </button>
        <LanguageSwitcher />
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {children}

          {/* Footer links */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {footerLinks.map((link, i) => (
              <a key={i} href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                {link}
              </a>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-3" style={{ fontFamily: "Inter, sans-serif" }}>
            © 2026 M10 Platform · Technology Development Group
          </p>
        </div>
      </div>
    </div>
  );
}