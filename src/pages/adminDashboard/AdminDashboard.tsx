import { useState } from "react";

import {
  CheckCircle2,
  XCircle,
  Eye,
  BarChart3,
  Code,
  Server,
  WifiOff,
  Plus,
  Filter,
  MoreHorizontal,
  Zap,
  Users,
  Activity,
  Globe,
  X
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { AdminSidebar } from "@/shared/ui/admin/components/AdminSidebar";
import { TopBar } from "@/shared/ui/admin/components/TopBar";
import { StatusBadge } from "@/pages/adminDashboard/components/StatusBadge";
import { TypeBadge } from "@/pages/adminDashboard/components/TypeBadge";
import { EnvStatusDot } from "@/pages/adminDashboard/components/EnvStatusDot";
import { NotifIcon } from "@/pages/adminDashboard/components/NotifIcon";
import { StatCard } from "@/shared/ui/admin/components/StatCard";

import { tx } from "@/shared/config/translations/adminDashboard";
import { useLangStore } from "@/shared/stores/langStore";
import { primary,danger,warning,success,bg } from "@/shared/styles/colors";
import { trendData, recentTests, environments, notifications,topUsers } from "@/entities/Dashboard";


export function AdminDashboard() {
  
  const { lang } = useLangStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [localNotifs, setLocalNotifs] = useState(notifications);

  const t = tx[lang];
  const unreadCount = localNotifs.filter((n) => !n.read).length;

  const overviewCards = [
    {
      label: t.overview.total,
      value: "1,284",
      delta: 12,
      deltaLabel: `+154 ${t.overview.thisWeek}`,
      icon: Activity,
      color: primary,
      bg: "#EEF2FF",
    },
    {
      label: t.overview.passed,
      value: "1,108",
      delta: 8,
      deltaLabel: "86.3% pass rate",
      icon: CheckCircle2,
      color: success,
      bg: "#EBFBEE",
    },
    {
      label: t.overview.failed,
      value: "134",
      delta: -3,
      deltaLabel: "10.4% failure rate",
      icon: XCircle,
      color: danger,
      bg: "#FFF5F5",
    },
    {
      label: t.overview.running,
      value: "11",
      delta: undefined,
      deltaLabel: "4 queued",
      icon: Zap,
      color: warning,
      bg: "#FFF9DB",
    },
  ];

  const quickActions = [
    { key: "createTest", icon: Plus, color: primary, bg: "#EEF2FF" },
    { key: "visualTest", icon: Eye, color: "#7048E8", bg: "#F3F0FF" },
    { key: "perfTest", icon: BarChart3, color: warning, bg: "#FFF9DB" },
    { key: "pageAnalysis", icon: Code, color: success, bg: "#EBFBEE" },
    { key: "newUser", icon: Users, color: "#E64980", bg: "#FFF0F6" },
  ];

  const markAllRead = () => setLocalNotifs((n) => n.map((x) => ({ ...x, read: true })));
  const clearAll = () => setLocalNotifs([]);
  const dismissNotif = (id: number) => setLocalNotifs((n) => n.filter((x) => x.id !== id));

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: bg, fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar */}
      <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <TopBar
          lang={lang}
          notifCount={unreadCount}
          onNotifClick={() => setNotifPanelOpen(!notifPanelOpen)}
        />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-gray-900 mb-0.5" style={{ fontSize: "1.375rem", fontFamily: "Inter, sans-serif" }}>
              {t.pageTitle}
            </h1>
            <p className="text-sm text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
              {t.pageSubtitle}
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {overviewCards.map((card, idx) => (
              <StatCard key={idx} {...card} />
            ))}
          </div>

          {/* Quick Actions */}
          <div
            className="mb-6 p-5 rounded-2xl border border-gray-100"
            style={{ backgroundColor: "#ffffff" }}
          >
            <h2 className="text-sm text-gray-700 mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
              {t.quickActions.title}
            </h2>
            <div className="flex flex-wrap gap-3">
              {quickActions.map(({ key, icon: Icon, color, bg }) => (
                <button
                  key={key}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-sm text-gray-700 cursor-pointer"
                  style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#ffffff" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = bg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon style={{ width: "15px", height: "15px", color }} />
                  </div>
                  {t.quickActions[key as keyof typeof t.quickActions]}
                </button>
              ))}
            </div>
          </div>

          {/* Grid: Chart + Notifications | Tests + Environments + Top Users */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* LEFT COLUMN (2/3) */}
            <div className="xl:col-span-2 space-y-6">
              {/* Trend Chart */}
              <div
                className="rounded-2xl border border-gray-100 p-5"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                    {t.chart.title}
                  </h2>
                  <div className="flex gap-4 text-xs text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-1 rounded-full inline-block" style={{ backgroundColor: success }} />
                      {t.chart.passed}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-1 rounded-full inline-block" style={{ backgroundColor: danger }} />
                      {t.chart.failed}
                    </span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradPassed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={success} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={success} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradFailed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={danger} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={danger} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", fontFamily: "Inter, sans-serif", fontSize: "12px" }}
                      itemStyle={{ fontFamily: "Inter, sans-serif" }}
                    />
                    <Area type="monotone" dataKey="passed" stroke={success} strokeWidth={2} fill="url(#gradPassed)" dot={false} activeDot={{ r: 4, fill: success }} />
                    <Area type="monotone" dataKey="failed" stroke={danger} strokeWidth={2} fill="url(#gradFailed)" dot={false} activeDot={{ r: 4, fill: danger }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Tests Table */}
              <div
                className="rounded-2xl border border-gray-100 overflow-hidden"
                style={{ backgroundColor: "#ffffff" }}
              >
                {/* Table header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                    {t.recentTests.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <Filter style={{ width: "12px", height: "12px" }} />
                      {t.recentTests.filter}
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-lg text-xs text-white cursor-pointer"
                      style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                    >
                      {t.recentTests.viewAll}
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: bg }}>
                        {["id", "name", "type", "status", "duration", "env", "time", "actions"].map((col) => (
                          <th
                            key={col}
                            className="px-4 py-3 text-left text-xs text-gray-400 whitespace-nowrap"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {col === "id" ? "#" : col === "actions" ? "" : t.recentTests.cols[col as keyof typeof t.recentTests.cols] ?? col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentTests.map((test) => (
                        <tr
                          key={test.id}
                          className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>{test.id}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-sm text-gray-800 whitespace-nowrap" style={{ fontFamily: "Inter, sans-serif" }}>{test.name}</p>
                              <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>{test.branch}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <TypeBadge type={test.type} />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <StatusBadge status={test.status} lang={lang} />
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-500 whitespace-nowrap" style={{ fontFamily: "Inter, sans-serif" }}>{test.duration}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-500 whitespace-nowrap" style={{ fontFamily: "Inter, sans-serif" }}>{test.env}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-400 whitespace-nowrap" style={{ fontFamily: "Inter, sans-serif" }}>{test.time}</span>
                          </td>
                          <td className="px-4 py-3">
                            <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400">
                              <MoreHorizontal style={{ width: "14px", height: "14px" }} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (1/3) */}
            <div className="space-y-6">
              {/* Notifications */}
              <div
                className="rounded-2xl border border-gray-100 overflow-hidden"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.notifications.title}
                    </h2>
                    {unreadCount > 0 && (
                      <span
                        className="text-white text-xs px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: danger, fontFamily: "Inter, sans-serif", fontSize: "11px" }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={markAllRead}
                      className="text-xs hover:opacity-75 transition-opacity cursor-pointer"
                      style={{ color: primary, fontFamily: "Inter, sans-serif" }}
                    >
                      {t.notifications.markAll}
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                  {localNotifs.length === 0 ? (
                    <div className="px-5 py-8 text-center">
                      <CheckCircle2 style={{ width: "32px", height: "32px", color: "#D1D5DB", margin: "0 auto 8px" }} />
                      <p className="text-sm text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>All clear!</p>
                    </div>
                  ) : (
                    localNotifs.map((notif) => (
                      <div
                        key={notif.id}
                        className="flex gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors relative"
                        style={{ opacity: notif.read ? 0.65 : 1 }}
                      >
                        <NotifIcon type={notif.type} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs text-gray-800 leading-snug" style={{ fontFamily: "Inter, sans-serif" }}>
                              {notif.title}
                              {!notif.read && (
                                <span className="inline-block w-1.5 h-1.5 rounded-full ml-1.5 mb-0.5 align-middle" style={{ backgroundColor: primary }} />
                              )}
                            </p>
                            <button
                              onClick={() => dismissNotif(notif.id)}
                              className="text-gray-300 hover:text-gray-500 transition-colors shrink-0 cursor-pointer"
                            >
                              <X style={{ width: "12px", height: "12px" }} />
                            </button>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 leading-snug" style={{ fontFamily: "Inter, sans-serif" }}>
                            {notif.message}
                          </p>
                          <p className="text-xs mt-1" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {localNotifs.length > 0 && (
                  <div className="px-4 py-3 border-t border-gray-100">
                    <button
                      onClick={clearAll}
                      className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors text-center cursor-pointer"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {t.notifications.clearAll}
                    </button>
                  </div>
                )}
              </div>

              {/* Environment Status */}
              <div
                className="rounded-2xl border border-gray-100 overflow-hidden"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                    {t.environments.title}
                  </h2>
                  <button
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {t.environments.viewAll}
                  </button>
                </div>
                <div className="p-4 space-y-2.5">
                  {environments.map((env, i) => {
                    const statusLabel =
                      env.status === "busy" ? t.environments.busy :
                      env.status === "idle" ? t.environments.idle :
                      t.environments.offline;
                    const statusColor =
                      env.status === "busy" ? success :
                      env.status === "idle" ? "#ADB5BD" : danger;
                    const pct = env.status === "offline" ? 0 : (env.executors / env.total) * 100;

                    return (
                      <div
                        key={i}
                        className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {env.status === "offline" ? (
                              <WifiOff style={{ width: "14px", height: "14px", color: danger }} />
                            ) : (
                              <Server style={{ width: "14px", height: "14px", color: env.status === "busy" ? success : "#ADB5BD" }} />
                            )}
                            <span className="text-xs text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                              {env.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <EnvStatusDot status={env.status} />
                            <span className="text-xs" style={{ color: statusColor, fontFamily: "Inter, sans-serif" }}>
                              {statusLabel}
                            </span>
                          </div>
                        </div>
                        {/* Capacity bar */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: "#F3F4F6" }}>
                            <div
                              className="h-1.5 rounded-full transition-all"
                              style={{
                                width: `${pct}%`,
                                backgroundColor:
                                  env.status === "offline" ? "#E5E7EB" :
                                  pct >= 80 ? danger :
                                  pct >= 50 ? warning : 
                                  success,
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 whitespace-nowrap" style={{ fontFamily: "Inter, sans-serif" }}>
                            {env.executors}/{env.total}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                          <Globe style={{ width: "10px", height: "10px", display: "inline", marginRight: "4px" }} />
                          {env.location}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Active Users */}
              <div
                className="rounded-2xl border border-gray-100 p-5"
                style={{ backgroundColor: "#ffffff" }}
              >
                <h2 className="text-sm text-gray-700 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                  {t.topUsers.title}
                </h2>
                <div className="space-y-3">
                  {topUsers.map((user, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: user.color, fontSize: "11px", fontFamily: "Inter, sans-serif" }}
                      >
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 truncate" style={{ fontFamily: "Inter, sans-serif" }}>
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate" style={{ fontFamily: "Inter, sans-serif" }}>
                          {user.role}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>{user.tests}</p>
                        <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>tests</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer
          className="px-6 py-3 border-t flex items-center justify-between"
          style={{ backgroundColor: "#ffffff", borderColor: "#E5E7EB" }}
        >
          <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
            © 2026 M10 Platform · Technology Development Group
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: success }} />
            {lang === "tr" ? "Tüm sistemler çalışıyor" : lang === "de" ? "Alle Systeme laufen" : "All systems operational"}
          </div>
        </footer>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}