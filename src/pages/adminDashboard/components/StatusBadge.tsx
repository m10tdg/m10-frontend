import { primary, danger, warning, success } from "@/shared/styles/colors";
import { tx } from "@/shared/config/translations/adminDashboard";
import type { Lang } from "@/shared/stores/types";

export function StatusBadge({ status }: { status: string; lang: Lang }) {
  
    const map: Record<string, { bg: string; color: string; dot: string }> = {
    passed: { bg: "#EBFBEE", color: "#2F9E44", dot: success },
    failed: { bg: "#FFF5F5", color: "#C92A2A", dot: danger },
    running: { bg: "#EEF2FF", color: "#3B5BDB", dot: primary },
    pending: { bg: "#FFF9DB", color: "#856404", dot: warning },
    queued: { bg: "#F3F0FF", color: "#6741D9", dot: "#7048E8" },
  };
  
  const s = map[status] ?? map.pending;
  const label = tx.en.status[status as keyof typeof tx.en.status] ?? status;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
      style={{ backgroundColor: s.bg, color: s.color, fontFamily: "Inter, sans-serif" }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{
          backgroundColor: s.dot,
          animation: status === "running" ? "pulse 1.5s infinite" : "none",
        }}
      />
      {label}
    </span>
  );
}