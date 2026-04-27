import React from "react";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface LicenseStatusBadgeProps {
  status: string;
  lang?: string;
}

const statusConfig: Record<string, { 
  bg: string; 
  text: string; 
  border: string; 
  icon: React.ElementType;
  labels: { en: string; tr: string; de: string };
}> = {
  active: {
    bg: "#EBFBEE",
    text: "#0CA678",
    border: "#C3FAE8",
    icon: CheckCircle2,
    labels: { en: "Active", tr: "Aktif", de: "Aktiv" },
  },
  expiring: {
    bg: "#FFF9DB",
    text: "#F59F00",
    border: "#FFE8A3",
    icon: AlertCircle,
    labels: { en: "Expiring Soon", tr: "Yakında Sona Eriyor", de: "Läuft bald ab" },
  },
  expired: {
    bg: "#FFF5F5",
    text: "#FA5252",
    border: "#FFE3E3",
    icon: XCircle,
    labels: { en: "Expired", tr: "Süresi Dolmuş", de: "Abgelaufen" },
  },
};

export function LicenseStatusBadge({ status, lang = "en" }: LicenseStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.active;
  const Icon = config.icon;
  const label = config.labels[lang as keyof typeof config.labels] || config.labels.en;

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderColor: config.border,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Icon style={{ width: "12px", height: "12px" }} />
      {label}
    </span>
  );
}