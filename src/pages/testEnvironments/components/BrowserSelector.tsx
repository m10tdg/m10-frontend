// pages/testEnvironments/components/BrowserSelector.tsx

import { browsers } from "@/entities/testEnvironments";
import { SiGooglechrome, SiFirefox, SiSafari } from "react-icons/si";
import { FaEdge } from "react-icons/fa";

const BROWSER_ICONS: Record<string, React.ReactNode> = {
  chrome:  <SiGooglechrome  style={{ width: 14, height: 14, color: "#4285F4" }} />,
  firefox: <SiFirefox       style={{ width: 14, height: 14, color: "#FF7139" }} />,
  safari:  <SiSafari        style={{ width: 14, height: 14, color: "#006CFF" }} />,
  edge:    <FaEdge          style={{ width: 14, height: 14, color: "#0078D4" }} />,
};

type Props = {
  selected: string[];          // array of selected browser values
  onChange: (val: string[]) => void;
  multi?: boolean;             // true = checkbox style, false = radio style
};

export function BrowserSelector({ selected, onChange, multi = false }: Props) {
  const toggle = (value: string) => {
    if (multi) {
      onChange(
        selected.includes(value)
          ? selected.filter((v) => v !== value)
          : [...selected, value]
      );
    } else {
      onChange([value]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {browsers.map((b) => {
        const isActive = selected.includes(b.value);
        return (
          <button
            key={b.value}
            onClick={() => toggle(b.value)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all cursor-pointer ${
              isActive
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <span>{BROWSER_ICONS[b.value]}</span>
            {b.label}
          </button>
        );
      })}
    </div>
  );
}