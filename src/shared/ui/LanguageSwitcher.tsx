import { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { primary } from "@/shared/styles/colors";
import { useLangStore } from "@/shared/stores/langStore";
import type { Lang } from "@/shared/stores/types";

// ─── Language Selector ────────────────────────────────────────────────────────
const langLabels: Record<Lang, string> = {
  en: "EN",
  tr: "TR",
  de: "DE",
};
const langFull: Record<Lang, string> = {
  en: "English",
  tr: "Türkçe",
  de: "Deutsch",
};

export function LanguageSwitcher() {
  const { lang, setLang } = useLangStore();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" style={{ color: primary }} />
        <span style={{ fontFamily: "Inter, sans-serif" }}>
          {langLabels[lang]}
        </span>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {(Object.keys(langLabels) as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => {
                setLang(l);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                lang === l
                  ? "text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              style={
                lang === l
                  ? { backgroundColor: primary, fontFamily: "Inter, sans-serif" }
                  : { fontFamily: "Inter, sans-serif" }
              }
            >
              <span>{langLabels[l]}</span>
              <span className="text-xs opacity-75">{langFull[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}