import { TrendingUp, TrendingDown } from "lucide-react";
import { success, danger } from "@/shared/styles/colors";

export function StatCard({
  label, value, delta, deltaLabel, icon: Icon, color, bg,
}: {
  label: string; value: string | number; delta?: number;
  deltaLabel?: string; icon: React.ElementType; color: string; bg: string;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div
      className="rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
          <Icon style={{ width: "20px", height: "20px", color }} />
        </div>
        {delta !== undefined && (
          <div
            className="flex items-center gap-1 text-xs"
            style={{ color: positive ? success : danger, fontFamily: "Inter, sans-serif" }}
          >
            {positive ? (
              <TrendingUp style={{ width: "14px", height: "14px" }} />
            ) : (
              <TrendingDown style={{ width: "14px", height: "14px" }} />
            )}
            {Math.abs(delta)}%
          </div>
        )}
      </div>
      <div className="text-gray-900 mb-1" style={{ fontSize: "1.75rem", fontFamily: "Inter, sans-serif" }}>
        {value}
      </div>
      <div className="text-sm text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
        {label}
      </div>
      {deltaLabel && (
        <div className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
          {deltaLabel}
        </div>
      )}
    </div>
  );
}