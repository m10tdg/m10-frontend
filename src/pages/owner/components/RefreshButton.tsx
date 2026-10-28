import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
  label: string;
  loading: boolean;
  onClick: () => void;
}

export function RefreshButton({ label, loading, onClick }: RefreshButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
    >
      <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
      {label}
    </button>
  );
}
