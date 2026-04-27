interface LicenseTypeBadgeProps {
  type: string;
  size?: "sm" | "md";
}

const typeConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
  enterprise: {
    bg: "#FFF0F6",
    text: "#E64980",
    border: "#FFDEEB",
    label: "Enterprise",
  },
  team: {
    bg: "#EEF2FF",
    text: "#4263EB",
    border: "#DBE4FF",
    label: "Team",
  },
  developer: {
    bg: "#EBFBEE",
    text: "#0CA678",
    border: "#C3FAE8",
    label: "Developer",
  },
  addon: {
    bg: "#FFF9DB",
    text: "#F59F00",
    border: "#FFE8A3",
    label: "Add-on",
  },
};

export function LicenseTypeBadge({ type, size = "sm" }: LicenseTypeBadgeProps) {
  const config = typeConfig[type] || typeConfig.developer;
  const padding = size === "sm" ? "px-2 py-0.5" : "px-3 py-1";
  const fontSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span
      className={`inline-flex items-center ${padding} rounded-md border ${fontSize}`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderColor: config.border,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {config.label}
    </span>
  );
}