import { Check } from "lucide-react";
import { success, warning, danger } from "@/shared/styles/colors";

interface PasswordStrengthIndicatorProps {
  password: string;
  translations: Record<string, any>;
}

export function getPasswordStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return { checks, score };
}

export function PasswordStrengthIndicator({ password, translations }: PasswordStrengthIndicatorProps) {
  const { checks, score } = getPasswordStrength(password);

  const strengthColor = score <= 1 ? danger : score <= 2 ? warning : score <= 3 ? warning : success;
  const strengthLabel =
    score <= 1 ? translations.passwordStrength.weak :
    score <= 2 ? translations.passwordStrength.fair :
    translations.passwordStrength.strong;

  if (password.length === 0) return null;

  return (
    <div className="mt-2.5">
      <div className="flex gap-1 mb-1.5">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{ backgroundColor: score >= step ? strengthColor : "#E5E7EB" }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
          {translations.passwordStrength.label}
        </span>
        <span className="text-xs" style={{ color: strengthColor, fontFamily: "Inter, sans-serif" }}>
          {strengthLabel}
        </span>
      </div>
      {/* Hint checklist */}
      <div className="grid grid-cols-2 gap-1">
        {(Object.entries(checks) as [keyof typeof checks, boolean][]).map(([key, passed]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-colors"
              style={{ backgroundColor: passed ? success : "#E5E7EB" }}
            >
              {passed && <Check className="w-2 h-2 text-white" strokeWidth={3} />}
            </div>
            <span className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
              {translations.passwordStrength.hints[key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}