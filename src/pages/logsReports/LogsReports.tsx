import { useState } from "react";
import {
  FileText,
  Search,
  Download,
  RefreshCw,
  Clock,
  TrendingUp,
  AlertCircle,
  Eye,
  Play,
  X,
  Calendar,
  Plus
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import { AdminSidebar } from "@/shared/ui/admin/components/AdminSidebar";
import { TopBar } from "@/shared/ui/admin/components/TopBar";
import { StatCard } from "@/shared/ui/admin/components/StatCard";
import { LogLevelBadge } from "@/pages/logsReports/components/LogLevelBadge";

import { useLangStore } from "@/shared/stores/langStore";
import { primary, danger, warning, success, bg } from "@/shared/styles/colors";
import {
  logEntries as initialLogs,
  logStats,
  logLevels,
  logSources,
  savedReports,
  logAnalytics,
  exportFormats,
  timeRanges,
} from "@/entities/logsReports";

type LogEntry = {
  id: number;
  timestamp: string;
  level: string;
  source: string;
  user: string;
  message: string;
  details: Record<string, any>;
  tags: string[];
};

type ModalType = "details" | "export" | "createReport" | "viewReport" | null;

export function LogsReports() {
  const { lang } = useLangStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);

  // State
  const [logs] = useState<LogEntry[]>(initialLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedSource, setSelectedSource] = useState("All Sources");
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [activeTab, setActiveTab] = useState<"logs" | "analytics" | "reports">("logs");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentLog, setCurrentLog] = useState<LogEntry | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Report form state
  const [reportForm, setReportForm] = useState({
    name: "",
    description: "",
    format: "pdf",
    schedule: "manual",
    filters: {
      level: "all",
      source: "All Sources",
      timeRange: "24h",
    },
  });

  const t = {
    pageTitle: lang === "tr" ? "Loglar & Raporlar" : lang === "de" ? "Protokolle & Berichte" : "Logs & Reports",
    pageSubtitle:
      lang === "tr"
        ? "Sistem loglarını izleyin, analiz edin ve raporlar oluşturun"
        : lang === "de"
        ? "Überwachen, analysieren und erstellen Sie Berichte aus Systemprotokollen"
        : "Monitor system logs, analyze patterns, and generate reports",
    stats: {
      total: lang === "tr" ? "Toplam Log" : lang === "de" ? "Gesamtprotokolle" : "Total Logs",
      today: lang === "tr" ? "Bugün" : lang === "de" ? "Heute" : "Today",
      errors: lang === "tr" ? "Hatalar" : lang === "de" ? "Fehler" : "Errors",
      warnings: lang === "tr" ? "Uyarılar" : lang === "de" ? "Warnungen" : "Warnings",
      avgResponse: lang === "tr" ? "Ort. Yanıt" : lang === "de" ? "Durchschn. Antwort" : "Avg Response",
      inLast24h: lang === "tr" ? "son 24 saatte" : lang === "de" ? "in den letzten 24h" : "in last 24h",
    },
    tabs: {
      logs: lang === "tr" ? "Canlı Loglar" : lang === "de" ? "Live-Protokolle" : "Live Logs",
      analytics: lang === "tr" ? "Analitik" : lang === "de" ? "Analytik" : "Analytics",
      reports: lang === "tr" ? "Raporlar" : lang === "de" ? "Berichte" : "Reports",
    },
    actions: {
      export: lang === "tr" ? "Dışa Aktar" : lang === "de" ? "Exportieren" : "Export",
      refresh: lang === "tr" ? "Yenile" : lang === "de" ? "Aktualisieren" : "Refresh",
      createReport: lang === "tr" ? "Rapor Oluştur" : lang === "de" ? "Bericht erstellen" : "Create Report",
      autoRefresh: lang === "tr" ? "Otomatik Yenileme" : lang === "de" ? "Auto-Aktualisierung" : "Auto-Refresh",
      viewDetails: lang === "tr" ? "Detayları Gör" : lang === "de" ? "Details anzeigen" : "View Details",
      runReport: lang === "tr" ? "Raporu Çalıştır" : lang === "de" ? "Bericht ausführen" : "Run Report",
      cancel: lang === "tr" ? "İptal Et" : lang === "de" ? "Abbrechen" : "Cancel",
    },
    filters: {
      search: lang === "tr" ? "Loglarda ara..." : lang === "de" ? "Protokolle durchsuchen..." : "Search logs...",
      level: lang === "tr" ? "Seviye" : lang === "de" ? "Stufe" : "Level",
      source: lang === "tr" ? "Kaynak" : lang === "de" ? "Quelle" : "Source",
      timeRange: lang === "tr" ? "Zaman Aralığı" : lang === "de" ? "Zeitbereich" : "Time Range",
    },
    table: {
      timestamp: lang === "tr" ? "Zaman" : lang === "de" ? "Zeitstempel" : "Timestamp",
      level: lang === "tr" ? "Seviye" : lang === "de" ? "Stufe" : "Level",
      source: lang === "tr" ? "Kaynak" : lang === "de" ? "Quelle" : "Source",
      message: lang === "tr" ? "Mesaj" : lang === "de" ? "Nachricht" : "Message",
      user: lang === "tr" ? "Kullanıcı" : lang === "de" ? "Benutzer" : "User",
      actions: lang === "tr" ? "İşlemler" : lang === "de" ? "Aktionen" : "Actions",
    },
    analytics: {
      title: lang === "tr" ? "Log Analitikleri" : lang === "de" ? "Protokollanalytik" : "Log Analytics",
      byLevel: lang === "tr" ? "Seviyeye Göre" : lang === "de" ? "Nach Stufe" : "By Level",
      bySource: lang === "tr" ? "Kaynağa Göre" : lang === "de" ? "Nach Quelle" : "By Source",
      timeline: lang === "tr" ? "Zaman Çizelgesi" : lang === "de" ? "Zeitachse" : "Timeline",
    },
    reports: {
      saved: lang === "tr" ? "Kaydedilmiş Raporlar" : lang === "de" ? "Gespeicherte Berichte" : "Saved Reports",
      name: lang === "tr" ? "Rapor Adı" : lang === "de" ? "Berichtsname" : "Report Name",
      type: lang === "tr" ? "Tür" : lang === "de" ? "Typ" : "Type",
      schedule: lang === "tr" ? "Zamanlama" : lang === "de" ? "Zeitplan" : "Schedule",
      lastRun: lang === "tr" ? "Son Çalıştırma" : lang === "de" ? "Zuletzt ausgeführt" : "Last Run",
      automated: lang === "tr" ? "Otomatik" : lang === "de" ? "Automatisiert" : "Automated",
      manual: lang === "tr" ? "Manuel" : lang === "de" ? "Manuell" : "Manual",
    },
    modal: {
      logDetails: lang === "tr" ? "Log Detayları" : lang === "de" ? "Protokolldetails" : "Log Details",
      exportLogs: lang === "tr" ? "Logları Dışa Aktar" : lang === "de" ? "Protokolle exportieren" : "Export Logs",
      createReport: lang === "tr" ? "Rapor Oluştur" : lang === "de" ? "Bericht erstellen" : "Create Report",
      close: lang === "tr" ? "Kapat" : lang === "de" ? "Schließen" : "Close",
      export: lang === "tr" ? "Dışa Aktar" : lang === "de" ? "Exportieren" : "Export",
      create: lang === "tr" ? "Oluştur" : lang === "de" ? "Erstellen" : "Create",
      format: lang === "tr" ? "Format" : lang === "de" ? "Format" : "Format",
      description: lang === "tr" ? "Açıklama" : lang === "de" ? "Beschreibung" : "Description",
    },
  };

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = selectedLevel === "all" || log.level === selectedLevel;
    const matchesSource = selectedSource === "All Sources" || log.source === selectedSource;

    return matchesSearch && matchesLevel && matchesSource;
  });

  const handleOpenModal = (type: ModalType, log?: LogEntry) => {
    setModalType(type);
    setCurrentLog(log || null);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setCurrentLog(null);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const overviewCards = [
    {
      label: t.stats.total,
      value: logStats.totalLogs.toLocaleString(),
      delta: undefined,
      deltaLabel: `${logStats.todayLogs.toLocaleString()} ${t.stats.today.toLowerCase()}`,
      icon: FileText,
      color: primary,
      bg: "#EEF2FF",
    },
    {
      label: t.stats.errors,
      value: logStats.errors.toString(),
      delta: undefined,
      deltaLabel: t.stats.inLast24h,
      icon: AlertCircle,
      color: danger,
      bg: "#FFF5F5",
    },
    {
      label: t.stats.warnings,
      value: logStats.warnings.toString(),
      delta: undefined,
      deltaLabel: t.stats.inLast24h,
      icon: AlertCircle,
      color: warning,
      bg: "#FFF9DB",
    },
    {
      label: t.stats.avgResponse,
      value: `${logStats.avgResponseTime}ms`,
      delta: undefined,
      deltaLabel: "Last hour average",
      icon: TrendingUp,
      color: success,
      bg: "#EBFBEE",
    },
  ];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: bg, fontFamily: "Inter, sans-serif" }}>
      <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar lang={lang} notifCount={0} onNotifClick={() => setNotifPanelOpen(!notifPanelOpen)} />

        <main className="flex-1 p-6 overflow-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-gray-900 mb-0.5" style={{ fontSize: "1.375rem", fontFamily: "Inter, sans-serif" }}>
              {t.pageTitle}
            </h1>
            <p className="text-sm text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
              {t.pageSubtitle}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {overviewCards.map((card, idx) => (
              <StatCard key={idx} {...card} />
            ))}
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex items-center gap-2 border-b border-gray-200">
              {(["logs", "analytics", "reports"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm transition-colors relative ${
                    activeTab === tab ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                  } cursor-pointer`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {t.tabs[tab]}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: primary }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Live Logs Tab */}
          {activeTab === "logs" && (
            <div className="space-y-6">
              {/* Toolbar */}
              <div className="rounded-2xl border border-gray-100 p-5" style={{ backgroundColor: "#ffffff" }}>
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        style={{ width: "16px", height: "16px" }}
                      />
                      <input
                        type="text"
                        placeholder={t.filters.search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      />
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {logLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedSource}
                      onChange={(e) => setSelectedSource(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {logSources.map((source) => (
                        <option key={source} value={source}>
                          {source}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedTimeRange}
                      onChange={(e) => setSelectedTimeRange(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {timeRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAutoRefresh(!autoRefresh)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                        autoRefresh ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      } cursor-pointer`}
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <RefreshCw style={{ width: "14px", height: "14px" }} />
                      {t.actions.autoRefresh}
                    </button>

                    <button
                      onClick={() => handleOpenModal("export")}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white cursor-pointer"
                      style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                    >
                      <Download style={{ width: "14px", height: "14px" }} />
                      {t.actions.export}
                    </button>
                  </div>
                </div>
              </div>

              {/* Log Stream */}
              <div className="rounded-2xl border border-gray-100 overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                      {lang === "tr" ? "Log Akışı" : lang === "de" ? "Protokollstream" : "Log Stream"}
                    </h2>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs text-white"
                      style={{ backgroundColor: success, fontFamily: "Inter, sans-serif" }}
                    >
                      {filteredLogs.length} logs
                    </span>
                  </div>
                </div>

                <div className="max-h-[600px] overflow-y-auto">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-20 shrink-0">
                          <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                            {formatTimestamp(log.timestamp)}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                            {formatDate(log.timestamp)}
                          </p>
                        </div>

                        <div className="shrink-0">
                          <LogLevelBadge level={log.level} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                                {log.message}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span style={{ fontFamily: "Inter, sans-serif" }}>
                                  <span className="text-gray-400">Source:</span> {log.source}
                                </span>
                                <span style={{ fontFamily: "Inter, sans-serif" }}>
                                  <span className="text-gray-400">User:</span> {log.user}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleOpenModal("details", log)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 shrink-0 cursor-pointer"
                            >
                              <Eye style={{ width: "14px", height: "14px" }} />
                            </button>
                          </div>

                          {log.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {log.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded text-xs"
                                  style={{
                                    backgroundColor: "#F3F4F6",
                                    color: "#6B7280",
                                    fontFamily: "Inter, sans-serif",
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredLogs.length === 0 && (
                    <div className="text-center py-12">
                      <FileText style={{ width: "48px", height: "48px", color: "#D1D5DB", margin: "0 auto 12px" }} />
                      <p className="text-sm text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                        {lang === "tr" ? "Log bulunamadı" : lang === "de" ? "Keine Protokolle gefunden" : "No logs found"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Timeline Chart */}
              <div className="xl:col-span-2 rounded-2xl border border-gray-100 p-5" style={{ backgroundColor: "#ffffff" }}>
                <h2 className="text-sm text-gray-700 mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
                  {t.analytics.timeline}
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={logAnalytics.timeline} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradErrors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={danger} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={danger} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradWarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={warning} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={warning} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradInfo" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={primary} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "Inter, sans-serif" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "Inter, sans-serif" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #E5E7EB",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="errors"
                      stroke={danger}
                      strokeWidth={2}
                      fill="url(#gradErrors)"
                      dot={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="warnings"
                      stroke={warning}
                      strokeWidth={2}
                      fill="url(#gradWarnings)"
                      dot={false}
                    />
                    <Area type="monotone" dataKey="info" stroke={primary} strokeWidth={2} fill="url(#gradInfo)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Logs by Level */}
              <div className="rounded-2xl border border-gray-100 p-5" style={{ backgroundColor: "#ffffff" }}>
                <h2 className="text-sm text-gray-700 mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
                  {t.analytics.byLevel}
                </h2>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={logAnalytics.byLevel}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {logAnalytics.byLevel.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {logAnalytics.byLevel.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                          {item.name}
                        </span>
                      </div>
                      <span className="text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                        {item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logs by Source */}
              <div className="rounded-2xl border border-gray-100 p-5" style={{ backgroundColor: "#ffffff" }}>
                <h2 className="text-sm text-gray-700 mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
                  {t.analytics.bySource}
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={logAnalytics.bySource} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "#9CA3AF", fontFamily: "Inter, sans-serif" }}
                      axisLine={false}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "Inter, sans-serif" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="value" fill={primary} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              {/* Create Report Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => handleOpenModal("createReport")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                >
                  <Plus style={{ width: "16px", height: "16px" }} />
                  {t.actions.createReport}
                </button>
              </div>

              {/* Saved Reports */}
              <div className="rounded-2xl border border-gray-100 overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                    {t.reports.saved}
                  </h2>
                </div>

                <div className="divide-y divide-gray-50">
                  {savedReports.map((report) => (
                    <div key={report.id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                              {report.name}
                            </h3>
                            <span
                              className="px-2 py-0.5 rounded text-xs capitalize"
                              style={{
                                backgroundColor: report.type === "automated" ? "#EBFBEE" : "#F3F4F6",
                                color: report.type === "automated" ? success : "#868E96",
                                fontFamily: "Inter, sans-serif",
                              }}
                            >
                              {report.type === "automated" ? t.reports.automated : t.reports.manual}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                            {report.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                              <Clock style={{ width: "12px", height: "12px" }} />
                              {report.schedule}
                            </span>
                            <span className="flex items-center gap-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                              <Calendar style={{ width: "12px", height: "12px" }} />
                              Last run: {formatDate(report.lastRun)}
                            </span>
                            <span
                              className="px-2 py-0.5 rounded"
                              style={{ backgroundColor: "#F3F4F6", fontFamily: "Inter, sans-serif" }}
                            >
                              {report.format.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenModal("viewReport")}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 cursor-pointer"
                          >
                            <Eye style={{ width: "16px", height: "16px" }} />
                          </button>
                          <button
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-white cursor-pointer"
                            style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                          >
                            <Play style={{ width: "12px", height: "12px" }} />
                            {t.actions.runReport}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer
          className="px-6 py-3 border-t flex items-center justify-between"
          style={{ backgroundColor: "#ffffff", borderColor: "#E5E7EB" }}
        >
          <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
            © 2025 M10 Platform · Technology Development Group
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: success }} />
            {lang === "tr"
              ? "Tüm sistemler çalışıyor"
              : lang === "de"
              ? "Alle Systeme laufen"
              : "All systems operational"}
          </div>
        </footer>
      </div>

      {/* Modals */}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-2xl border border-gray-100 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            style={{ backgroundColor: "#ffffff" }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                {modalType === "details" && t.modal.logDetails}
                {modalType === "export" && t.modal.exportLogs}
                {modalType === "createReport" && t.modal.createReport}
                {modalType === "viewReport" && "Report Details"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 cursor-pointer"
              >
                <X style={{ width: "18px", height: "18px" }} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Log Details Modal */}
              {modalType === "details" && currentLog && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <LogLevelBadge level={currentLog.level} size="md" />
                    <span className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                      {new Date(currentLog.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                      Message
                    </p>
                    <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                      {currentLog.message}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                        Source
                      </p>
                      <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                        {currentLog.source}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                        User
                      </p>
                      <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                        {currentLog.user}
                      </p>
                    </div>
                  </div>

                  {currentLog.tags.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                        Tags
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {currentLog.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-lg border border-gray-200 text-sm"
                            style={{ backgroundColor: "#F8F9FA", fontFamily: "Inter, sans-serif" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-gray-400 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                      Details
                    </p>
                    <div
                      className="p-4 rounded-lg text-xs overflow-x-auto"
                      style={{ backgroundColor: "#F8F9FA", fontFamily: "monospace" }}
                    >
                      <pre>{JSON.stringify(currentLog.details, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Export Modal */}
              {modalType === "export" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.modal.format}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {exportFormats.map((format) => (
                        <button
                          key={format.value}
                          className="p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left cursor-pointer"
                        >
                          <div className="text-2xl mb-2">{format.icon}</div>
                          <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                            {format.label}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl" style={{ backgroundColor: bg }}>
                    <p className="text-sm text-gray-900 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                      Export Summary
                    </p>
                    <div className="text-xs text-gray-600 space-y-1" style={{ fontFamily: "Inter, sans-serif" }}>
                      <p>• {filteredLogs.length} log entries</p>
                      <p>• Time range: {selectedTimeRange}</p>
                      <p>• Filters: {selectedLevel !== "all" ? selectedLevel : "All levels"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Create Report Modal */}
              {modalType === "createReport" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.reports.name}
                    </label>
                    <input
                      type="text"
                      value={reportForm.name}
                      onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ fontFamily: "Inter, sans-serif" }}
                      placeholder="e.g., Daily Error Summary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.modal.description}
                    </label>
                    <textarea
                      value={reportForm.description}
                      onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                      style={{ fontFamily: "Inter, sans-serif" }}
                      placeholder="Describe what this report includes..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.modal.format}
                      </label>
                      <select
                        value={reportForm.format}
                        onChange={(e) => setReportForm({ ...reportForm, format: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {exportFormats.map((format) => (
                          <option key={format.value} value={format.value}>
                            {format.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.reports.schedule}
                      </label>
                      <select
                        value={reportForm.schedule}
                        onChange={(e) => setReportForm({ ...reportForm, schedule: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        <option value="manual">Manual</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {modalType === "details" ? t.modal.close : t.actions.cancel}
              </button>

              {modalType === "export" && (
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2 cursor-pointer"
                  style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                >
                  <Download style={{ width: "14px", height: "14px" }} />
                  {t.modal.export}
                </button>
              )}

              {modalType === "createReport" && (
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2 cursor-pointer"
                  style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                >
                  <Plus style={{ width: "14px", height: "14px" }} />
                  {t.modal.create}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}