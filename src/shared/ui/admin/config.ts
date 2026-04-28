import {  
  LayoutDashboard,
  Users,
  Server,
  GitBranch,
  Shield,
  Settings,
  FileText,
  KeyRound,
 } from "lucide-react";

export const navItems = [
  { key: "dashboard", icon: LayoutDashboard, path: "/admin" },
  { key: "users", icon: Users, path: "/admin/users" },
  { key: "environments", icon: Server, path: "/admin/environments" },
  { key: "cicd", icon: GitBranch, path: "/admin/cicd" },
  { key: "security", icon: Shield, path: "/admin/security" },
  { key: "licenses", icon: KeyRound, path: "/admin/licenses" },
  { key: "logs", icon: FileText, path: "/admin/logs-reports" },
  { key: "settings", icon: Settings, path: "/admin/settings" },
];