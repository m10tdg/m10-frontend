import { LogOut, ShieldCheck } from "lucide-react";

import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher";
import type { PlatformOwner } from "@/shared/stores/types";

interface OwnerHeaderProps {
  owner: PlatformOwner | null;
  badge: string;
  signOutLabel: string;
  onSignOut: () => void;
}

export function OwnerHeader({ owner, badge, signOutLabel, onSignOut }: OwnerHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 h-16 bg-gray-900 text-white">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-600">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm leading-tight">M10 Platform</p>
          <p className="text-xs leading-tight text-gray-400">{badge}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {owner && (
          <div className="hidden sm:block text-right">
            <p className="text-sm leading-tight">{owner.name}</p>
            <p className="text-xs leading-tight text-gray-400">{owner.email}</p>
          </div>
        )}
        <LanguageSwitcher />
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">{signOutLabel}</span>
        </button>
      </div>
    </header>
  );
}
