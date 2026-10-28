import { NavLink } from "react-router-dom";
import { Building2, LayoutDashboard, Users } from "lucide-react";

import type { OwnerTranslations } from "@/shared/config/translations/owner";

interface OwnerSidebarProps {
  tx: OwnerTranslations["nav"];
}

export function OwnerSidebar({ tx }: OwnerSidebarProps) {
  const items = [
    { to: "/owner", label: tx.overview, icon: LayoutDashboard, end: true },
    { to: "/owner/tenants", label: tx.tenants, icon: Building2, end: false },
    { to: "/owner/owners", label: tx.owners, icon: Users, end: false },
  ];

  return (
    <aside className="bg-white border-b border-gray-200 lg:border-b-0 lg:border-r lg:w-60 lg:shrink-0 lg:min-h-[calc(100vh-4rem)]">
      <nav className="flex lg:flex-col gap-1 p-3 overflow-x-auto">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
