import { danger, success, secondary } from "@/shared/styles/colors";

export function EnvStatusDot({ status }: { status: string }) {
  const color = status === "busy" ? success : status === "idle" ? secondary : danger;
  return (
    <span
      className="inline-block w-2 h-2 rounded-full"
      style={{
        backgroundColor: color,
        animation: status === "busy" ? "pulse 2s infinite" : "none",
      }}
    />
  );
}