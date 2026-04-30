// pages/testEnvironments/components/BrowserSelector.tsx

import { browsers } from "@/entities/testEnvironments";

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
            <span>{b.icon}</span>
            {b.label}
          </button>
        );
      })}
    </div>
  );
}