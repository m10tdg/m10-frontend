export function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    Visual: "#F3F0FF",
    Live: "#EEF2FF",
    Performance: "#FFF9DB",
    "Page Analysis": "#E3FAFC",
    Accessibility: "#FFF0F6",
  };
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-md text-xs text-gray-600"
      style={{ backgroundColor: map[type] ?? "#F3F4F6", fontFamily: "Inter, sans-serif" }}
    >
      {type}
    </span>
  );
}