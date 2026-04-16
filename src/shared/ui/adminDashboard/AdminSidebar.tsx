import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  TestTube,
  LogOut,
  BadgeAlert,
} from "lucide-react";

import { useLangStore } from "@/shared/stores/langStore";
import { navTranslations } from "@/shared/config/translations/adminDashboard";
import { navItems } from "./config";
import {primary} from '@/shared/styles/colors'

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export function AdminSidebar({ collapsed, setCollapsed }: AdminSidebarProps) {
  
  const { lang } = useLangStore();
  const navigate = useNavigate();
  const location = useLocation();
  const tx = navTranslations[lang];

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 transition-all duration-300 z-40 border-r"
      style={{
        width: collapsed ? "64px" : "240px",
        backgroundColor: "#111827",
        borderColor: "#1F2937",
        minWidth: collapsed ? "64px" : "240px",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 border-b"
        style={{ height: "64px", borderColor: "#1F2937" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: primary }}
        >
          <TestTube className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span
              className="text-white text-sm whitespace-nowrap"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              M10 Platform
            </span>
            <p
              className="text-xs whitespace-nowrap"
              style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}
            >
              Admin Panel
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        <div className="space-y-0.5 px-2">
          {navItems.map(({ key, icon: Icon, path }) => {
            const isActive =
              path === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(path);
            return (
              <button
                key={key}
                onClick={() => navigate(path)}
                title={collapsed ? tx[key] : undefined}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group"
                style={{
                  backgroundColor: isActive ? primary : "transparent",
                  color: isActive ? "#ffffff" : "#9CA3AF",
                  fontFamily: "Inter, sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "#1F2937";
                    e.currentTarget.style.color = "#F9FAFB";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#9CA3AF";
                  }
                }}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" style={{ width: "18px", height: "18px" }} />
                {!collapsed && (
                  <span className="text-sm whitespace-nowrap overflow-hidden">{tx[key]}</span>
                )}
                {!collapsed && key === "users" && (
                  <span
                    className="ml-auto text-xs px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "#374151", color: isActive ? "#fff" : "#9CA3AF" }}
                  >
                    12
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Admin badge */}
      {!collapsed && (
        <div className="px-4 pb-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ backgroundColor: "#1F2937" }}
          >
            <BadgeAlert className="w-4 h-4 shrink-0" style={{ color: "#FAB005" }} />
            <div className="min-w-0">
              <p className="text-xs text-white truncate" style={{ fontFamily: "Inter, sans-serif" }}>
                Admin
              </p>
              <p className="text-xs truncate" style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}>
                super@m10.dev
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="px-2 pb-3 border-t" style={{ borderColor: "#1F2937", paddingTop: "12px" }}>
        <button
          onClick={() => navigate("/login")}
          title={collapsed ? tx.logout : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left"
          style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#1F2937";
            e.currentTarget.style.color = "#FA5252";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#6B7280";
          }}
        >
          <LogOut style={{ width: "18px", height: "18px", flexShrink: 0 }} />
          {!collapsed && <span className="text-sm">{tx.logout}</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full border flex items-center justify-center transition-colors z-50"
        style={{ backgroundColor: "#111827", borderColor: "#374151", color: "#9CA3AF" }}
        aria-label={collapsed ? tx.expand : tx.collapse}
      >
        {collapsed ? (
          <ChevronRight style={{ width: "12px", height: "12px" }} />
        ) : (
          <ChevronLeft style={{ width: "12px", height: "12px" }} />
        )}
      </button>
    </aside>
  );
}
