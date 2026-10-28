import { AlertCircle, CheckCircle2 } from "lucide-react";

interface NoticeProps {
  kind: "success" | "error";
  children: React.ReactNode;
  className?: string;
}

export function Notice({ kind, children, className = "" }: NoticeProps) {
  const Icon = kind === "success" ? CheckCircle2 : AlertCircle;
  const colors = kind === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700";
  return (
    <div
      role={kind === "success" ? "status" : "alert"}
      className={`flex items-center gap-2.5 p-3.5 rounded-xl text-sm ${colors} ${className}`}
    >
      <Icon className="w-4.5 h-4.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
