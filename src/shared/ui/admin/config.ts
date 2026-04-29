import {  
  LayoutDashboard,
  Users,
  Server,
  Settings,
  FileText,
  KeyRound,
 } from "lucide-react";

export const navItems = [
  { key: "dashboard", icon: LayoutDashboard, path: "/admin" },
  { key: "users", icon: Users, path: "/admin/users" },
  { key: "environments", icon: Server, path: "/admin/environments" },
  { key: "licenses", icon: KeyRound, path: "/admin/licenses" },
  { key: "logs", icon: FileText, path: "/admin/logs-reports" },
  { key: "settings", icon: Settings, path: "/admin/settings" },
];