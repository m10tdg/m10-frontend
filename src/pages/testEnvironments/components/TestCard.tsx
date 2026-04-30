// pages/testEnvironments/components/TestCard.tsx

import { StatusBadge } from "./StatusBadge";

type Props = {
  url: string;
  meta: string;        // e.g. "Chrome · 1920×1080"
  status: string;
  timestamp: string;
  extra?: string;      // e.g. "2 screenshots" or "LCP: 1.2s"
  onView?: () => void;
};

export function TestCard({ url, meta, status, timestamp, extra, onView }: Props) {
  const time = new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
  const date = new Date(timestamp).toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });

  return (
    <div className="px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 truncate" style={{ fontFamily: "Inter, sans-serif" }}>{url}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
          <span style={{ fontFamily: "Inter, sans-serif" }}>{meta}</span>
          {extra && <span className="text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>· {extra}</span>}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <StatusBadge status={status} />
        <span className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>{date} {time}</span>
        {onView && (
          <button
            onClick={onView}
            className="text-xs text-blue-500 hover:underline cursor-pointer"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            View
          </button>
        )}
      </div>
    </div>
  );
}