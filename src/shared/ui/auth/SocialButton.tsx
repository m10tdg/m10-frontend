interface SocialButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function SocialButton({ children, onClick }: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm text-gray-700 cursor-pointer"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {children}
    </button>
  );
}