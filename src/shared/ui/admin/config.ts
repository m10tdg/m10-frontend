import {  
  LayoutDashboard,
  Users,
  Server,
  Settings,
  FileText,
  KeyRound,
  FlaskConical,
 } from "lucide-react";

export const navItems = [
  { key: "dashboard", icon: LayoutDashboard, path: "/admin" },
  { key: "users", icon: Users, path: "/admin/users" },
  { key: "environments", icon: Server, path: "/admin/test-environments" },
  { key: "licenses", icon: KeyRound, path: "/admin/licenses" },
  { key: "logs", icon: FileText, path: "/admin/logs-reports" },
  { key: "myTester", icon: FlaskConical, path: "/admin/my-tester" },
  { key: "settings", icon: Settings, path: "/admin/settings" },
];