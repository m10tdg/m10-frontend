import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, RefreshCw, ChevronDown } from 'lucide-react';

import { useLangStore } from "@/shared/stores/langStore";
import { tx } from "@/shared/config/translations/adminDashboard";
import { primary, danger } from "@/shared/styles/colors";
import type { Lang } from "@/shared/stores/types";
import { bg } from "@/shared/styles/colors";


export function TopBar({
  lang,
  notifCount,
  onNotifClick,
}: {
  lang: Lang;
  notifCount: number;
  onNotifClick: () => void;
}) {

  const navigate = useNavigate();
  const { setLang } = useLangStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const langLabels: Record<Lang, string> = { en: "EN", tr: "TR", de: "DE" };

  return (
    <header
      className="flex items-center justify-between px-6 border-b"
      style={{ height: "64px", backgroundColor: "#ffffff", borderColor: "#E5E7EB" }}
    >
      {/* Search */}
      <div className="relative hidden sm:block">
        <Search
          style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#9CA3AF" }}
        />
        <input
          type="search"
          placeholder={tx[lang].search}
          className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none w-72"
          style={{
            fontFamily: "Inter, sans-serif",
            backgroundColor: bg,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = primary;
            e.currentTarget.style.boxShadow = `0 0 0 3px rgba(76,110,245,0.1)`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#E5E7EB";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Refresh */}
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <RefreshCw style={{ width: "14px", height: "14px" }} />
          <span className="hidden md:inline">{tx[lang].refresh}</span>
        </button>

        {/* Notifications */}
        <button
          onClick={onNotifClick}
          className="relative w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <Bell style={{ width: "16px", height: "16px", color: "#6B7280" }} />
          {notifCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full text-white flex items-center justify-center"
              style={{ fontSize: "10px", backgroundColor: danger, width: "18px", height: "18px", fontFamily: "Inter, sans-serif" }}
            >
              {notifCount}
            </span>
          )}
        </button>

        {/* Language */}
        <div className="flex gap-1 border border-gray-200 rounded-xl p-1">
          {(["en", "tr", "de"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className="px-2 py-1 rounded-lg text-xs transition-colors cursor-pointer"
              style={{
                backgroundColor: lang === l ? primary : "transparent",
                color: lang === l ? "#fff" : "#6B7280",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {langLabels[l]}
            </button>
          ))}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs"
              style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
            >
              AD
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs text-gray-900 leading-tight" style={{ fontFamily: "Inter, sans-serif" }}>Admin</p>
              <p className="text-xs leading-tight" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>System Admin</p>
            </div>
            <ChevronDown style={{ width: "14px", height: "14px", color: "#9CA3AF" }} />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden py-1">
              {[
                { label: lang === "tr" ? "Profil" : lang === "de" ? "Profil" : "Profile", action: () => navigate("/profile") },
                { label: lang === "tr" ? "Ayarlar" : lang === "de" ? "Einstellungen" : "Settings", action: () => {} },
                { label: lang === "tr" ? "Çıkış Yap" : lang === "de" ? "Abmelden" : "Sign Out", action: () => navigate("/login") },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => { item.action(); setProfileOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}