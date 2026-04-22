interface RoleBadgeProps {
  roleType: string;
  label?: string;
  size?: "sm" | "md";
}

const roleColors: Record<string, { bg: string; text: string; border: string }> = {
  admin: {
    bg: "#FFF0F6",
    text: "#E64980",
    border: "#FFDEEB",
  },
  qa: {
    bg: "#EEF2FF",
    text: "#4263EB",
    border: "#DBE4FF",
  },
  developer: {
    bg: "#EBFBEE",
    text: "#0CA678",
    border: "#C3FAE8",
  },
  viewer: {
    bg: "#F8F9FA",
    text: "#868E96",
    border: "#E9ECEF",
  },
};

export function RoleBadge({ roleType, label, size = "sm" }: RoleBadgeProps) {
  const colors = roleColors[roleType] || roleColors.viewer;
  const padding = size === "sm" ? "px-2 py-0.5" : "px-3 py-1";
  const fontSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span
      className={`inline-flex items-center ${padding} rounded-md border ${fontSize}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {label || roleType}
    </span>
  );
}