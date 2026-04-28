import React from "react";
import { AlertCircle, AlertTriangle, Info, Bug } from "lucide-react";

interface LogLevelBadgeProps {
  level: string;
  size?: "sm" | "md";
}

const levelConfig: Record<
  string,
  { bg: string; text: string; border: string; icon: React.ElementType }
> = {
  error: {
    bg: "#FFF5F5",
    text: "#FA5252",
    border: "#FFE3E3",
    icon: AlertCircle,
  },
  warning: {
    bg: "#FFF9DB",
    text: "#F59F00",
    border: "#FFE8A3",
    icon: AlertTriangle,
  },
  info: {
    bg: "#EEF2FF",
    text: "#4263EB",
    border: "#DBE4FF",
    icon: Info,
  },
  debug: {
    bg: "#F8F9FA",
    text: "#868E96",
    border: "#E9ECEF",
    icon: Bug,
  },
};

export function LogLevelBadge({ level, size = "sm" }: LogLevelBadgeProps) {
  const config = levelConfig[level] || levelConfig.info;
  const Icon = config.icon;
  const padding = size === "sm" ? "px-2 py-0.5" : "px-3 py-1";
  const fontSize = size === "sm" ? "text-xs" : "text-sm";
  const iconSize = size === "sm" ? "12px" : "14px";

  return (
    <span
      className={`inline-flex items-center gap-1 ${padding} rounded-md border ${fontSize} uppercase`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderColor: config.border,
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
        letterSpacing: "0.025em",
      }}
    >
      <Icon style={{ width: iconSize, height: iconSize }} />
      {level}
    </span>
  );
}