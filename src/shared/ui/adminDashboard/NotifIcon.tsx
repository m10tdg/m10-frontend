import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { danger, primary, success, warning } from "@/shared/styles/colors";

export function NotifIcon({ type }: { type: string }) {
  const map: Record<string, { icon: typeof AlertTriangle; color: string; bg: string }> = {
    error: { icon: XCircle, color: danger, bg: "#FFF5F5" },
    warning: { icon: AlertTriangle, color: warning, bg: "#FFF9DB" },
    info: { icon: Info, color: primary, bg: "#EEF2FF" },
    success: { icon: CheckCircle2, color: success, bg: "#EBFBEE" },
  };
  const cfg = map[type] ?? map.info;
  const Icon = cfg.icon;
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: cfg.bg }}>
      <Icon style={{ width: "16px", height: "16px", color: cfg.color }} />
    </div>
  );
}