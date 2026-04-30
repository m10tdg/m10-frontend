// pages/testEnvironments/components/StatusBadge.tsx

type Props = {
  status: "passed" | "failed" | "running" | "idle" | "offline" | "ready" | "active" | string;
  size?: "sm" | "md";
};

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  passed:  { label: "Passed",  bg: "#EBFBEE", color: "#2F9E44" },
  failed:  { label: "Failed",  bg: "#FFF5F5", color: "#E03131" },
  running: { label: "Running", bg: "#EEF2FF", color: "#3B5BDB" },
  idle:    { label: "Idle",    bg: "#F8F9FA", color: "#868E96" },
  offline: { label: "Offline", bg: "#F1F3F5", color: "#ADB5BD" },
  ready:   { label: "Ready",   bg: "#FFF9DB", color: "#F59F00" },
  active:  { label: "Active",  bg: "#EBFBEE", color: "#2F9E44" },
};

export function StatusBadge({ status, size = "sm" }: Props) {
  const config = STATUS_MAP[status] ?? { label: status, bg: "#F3F4F6", color: "#6B7280" };
  const padding = size === "md" ? "px-3 py-1" : "px-2 py-0.5";
  const fontSize = size === "md" ? "text-sm" : "text-xs";

  return (
    <span
      className={`${padding} ${fontSize} rounded-full font-medium`}
      style={{ backgroundColor: config.bg, color: config.color, fontFamily: "Inter, sans-serif" }}
    >
      {config.label}
    </span>
  );
}