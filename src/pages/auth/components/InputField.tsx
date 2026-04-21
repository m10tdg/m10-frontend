import { AlertCircle } from "lucide-react";
import { primary, danger } from "@/shared/styles/colors";

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  icon: React.ElementType;
  rightElement?: React.ReactNode;
  autoComplete?: string;
}

export function InputField({
  id, label, type, placeholder, value, onChange, onBlur,
  error, icon: Icon, rightElement, autoComplete,
}: InputFieldProps) {
  const hasError = Boolean(error);
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-gray-700 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon className="w-4.5 h-4.5" style={{ color: hasError ? danger : "#9CA3AF", width: "18px", height: "18px" }} />
        </div>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          autoComplete={autoComplete}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400"
          style={{
            fontFamily: "Inter, sans-serif",
            borderColor: hasError ? danger : "#E5E7EB",
            backgroundColor: hasError ? "#FFF5F5" : "#ffffff",
            boxShadow: hasError ? `0 0 0 3px rgba(250,82,82,0.1)` : "none",
          }}
          onFocus={(e) => {
            if (!hasError) {
              e.currentTarget.style.borderColor = primary;
              e.currentTarget.style.boxShadow = `0 0 0 3px rgba(76,110,245,0.12)`;
            }
          }}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {hasError && (
        <p className="mt-1.5 text-xs flex items-center gap-1" style={{ color: danger, fontFamily: "Inter, sans-serif" }}>
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}