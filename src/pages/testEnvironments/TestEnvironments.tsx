// pages/testEnvironments/TestEnvironments.tsx

import { useState } from "react";
import {
  Monitor, GitCompare, Camera, BarChart2,
  Play, Circle, Server, Plus, RefreshCw,
  Globe, Settings, X, Trash2, CheckCircle,
} from "lucide-react";

import { AdminSidebar } from "@/shared/ui/admin/components/AdminSidebar";
import { TopBar }       from "@/shared/ui/admin/components/TopBar";
import { StatCard }     from "@/shared/ui/admin/components/StatCard";

import { StatusBadge }     from "./components/StatusBadge";
import { BrowserSelector } from "./components/BrowserSelector";
import { TestCard }        from "./components/TestCard";

import { useLangStore } from "@/shared/stores/langStore";
import { primary, danger, warning, success, bg } from "@/shared/styles/colors";

import {
  testStats,
  resolutions,
  recentLiveTests,
  recentCompareTests,
  recentVisualTests,
  recentPageAnalytics,
  recorderSessions,
  seleniumGridNodes,
} from "@/entities/testEnvironments";

type ManualTab = "live" | "compare" | "visual" | "analytics";
type AutoTab   = "recorder" | "selenium";
type MainTab   = "manual" | "automated";

export function TestEnvironments() {
  const { lang } = useLangStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifPanelOpen,   setNotifPanelOpen]   = useState(false);

  const [mainTab,   setMainTab]   = useState<MainTab>("manual");
  const [manualTab, setManualTab] = useState<ManualTab>("live");
  const [autoTab,   setAutoTab]   = useState<AutoTab>("recorder");

  // Live Test form
  const [liveUrl,        setLiveUrl]        = useState("");
  const [liveBrowser,    setLiveBrowser]    = useState<string[]>(["chrome"]);
  const [liveResolution, setLiveResolution] = useState("1920x1080");

  // Compare form
  const [compareUrl,        setCompareUrl]        = useState("");
  const [compareBrowsers,   setCompareBrowsers]   = useState<string[]>(["chrome", "firefox"]);
  const [compareResolution, setCompareResolution] = useState("1920x1080");

  // Visual form
  const [visualUrl,        setVisualUrl]        = useState("");
  const [visualBrowsers,   setVisualBrowsers]   = useState<string[]>(["chrome"]);
  const [visualResolution, setVisualResolution] = useState("1920x1080");

  // Page Analytics form
  const [analyticsUrl,      setAnalyticsUrl]      = useState("");
  const [analyticsBrowsers, setAnalyticsBrowsers] = useState<string[]>(["chrome"]);

  const t = {
  pageTitle: lang === "tr" ? "Test Ortamları" : lang === "de" ? "Testumgebungen" : "Test Environments",
  pageSubtitle:
    lang === "tr"
      ? "Tarayıcılar ve cihazlar üzerinde manuel ve otomatik testler çalıştırın"
      : lang === "de"
      ? "Führen Sie manuelle und automatisierte Tests über Browser und Geräte hinweg durch"
      : "Run manual and automated tests across browsers and devices",

  stats: {
    totalTests:  lang === "tr" ? "Toplam Test"     : lang === "de" ? "Gesamttests"        : "Total Tests",
    passed:      lang === "tr" ? "Başarılı"        : lang === "de" ? "Bestanden"          : "Passed",
    failed:      lang === "tr" ? "Başarısız"       : lang === "de" ? "Fehlgeschlagen"     : "Failed",
    avgDuration: lang === "tr" ? "Ort. Süre"       : lang === "de" ? "Durchschn. Dauer"   : "Avg Duration",
    today:       lang === "tr" ? "bugün"           : lang === "de" ? "heute"              : "today",
    perTest:     lang === "tr" ? "test başına"     : lang === "de" ? "pro Test"           : "per test",
    allTime:     lang === "tr" ? "toplam"          : lang === "de" ? "insgesamt"          : "all time",
  },

  mainTabs: {
    manual:    lang === "tr" ? "Manuel Test"     : lang === "de" ? "Manuelles Testen"    : "Manual Testing",
    automated: lang === "tr" ? "Otomatik Test"   : lang === "de" ? "Automatisiertes Testen" : "Automated Testing",
  },

  manualTabs: {
    live:      lang === "tr" ? "Canlı Test"         : lang === "de" ? "Live-Test"              : "Live Testing",
    compare:   lang === "tr" ? "Karşılaştır"        : lang === "de" ? "Vergleichen"            : "Compare",
    visual:    lang === "tr" ? "Görsel Test"        : lang === "de" ? "Visueller Test"         : "Visual Testing",
    analytics: lang === "tr" ? "Sayfa Analitiği"    : lang === "de" ? "Seitenanalyse"          : "Page Analytics",
  },

  autoTabs: {
    recorder: lang === "tr" ? "Test Kaydedici"  : lang === "de" ? "Test-Recorder"    : "Test Recorder",
    selenium: lang === "tr" ? "Selenium Grid"   : lang === "de" ? "Selenium Grid"    : "Selenium Grid",
  },

  fields: {
    url:        lang === "tr" ? "URL"               : lang === "de" ? "URL"                 : "URL",
    resolution: lang === "tr" ? "Çözünürlük"        : lang === "de" ? "Auflösung"           : "Resolution",
    browser:    lang === "tr" ? "Tarayıcı"          : lang === "de" ? "Browser"             : "Browser",
    browsers:   lang === "tr" ? "Tarayıcılar"       : lang === "de" ? "Browser"             : "Select Browsers",
    compareBrowsers:
      lang === "tr" ? "Karşılaştırılacak Tarayıcılar (en az 2 seçin)"
      : lang === "de" ? "Browser zum Vergleichen (mindestens 2 auswählen)"
      : "Select Browsers to Compare (select 2 or more)",
  },

  actions: {
    runTest:          lang === "tr" ? "Testi Çalıştır"       : lang === "de" ? "Test starten"           : "Run Test",
    runComparison:    lang === "tr" ? "Karşılaştır"          : lang === "de" ? "Vergleich starten"      : "Run Comparison",
    generateScreenshots: lang === "tr" ? "Ekran Görüntüsü Al" : lang === "de" ? "Screenshots erstellen" : "Generate Screenshots",
    generateAnalytics: lang === "tr" ? "Analiz Oluştur"      : lang === "de" ? "Analyse generieren"    : "Generate Analytics",
    newRecording:     lang === "tr" ? "Yeni Kayıt"           : lang === "de" ? "Neue Aufnahme"         : "New Recording",
    run:              lang === "tr" ? "Çalıştır"             : lang === "de" ? "Ausführen"             : "Run",
    view:             lang === "tr" ? "Görüntüle"            : lang === "de" ? "Anzeigen"              : "View",
  },

  panels: {
    liveConfig:       lang === "tr" ? "Canlı Test Yapılandırması"    : lang === "de" ? "Live-Test-Konfiguration"      : "Live Testing Configuration",
    crossBrowser:     lang === "tr" ? "Çapraz Tarayıcı Karşılaştırması" : lang === "de" ? "Browserübergreifender Vergleich" : "Cross-Browser Comparison",
    visualConfig:     lang === "tr" ? "Görsel Test & Ekran Görüntüleri" : lang === "de" ? "Visuelles Testen & Screenshots" : "Visual Testing & Screenshots",
    analyticsConfig:  lang === "tr" ? "Sayfa Analitiği — Core Web Vitals" : lang === "de" ? "Seitenanalyse — Core Web Vitals" : "Page Analytics — Core Web Vitals",
    recentLive:       lang === "tr" ? "Son Canlı Testler"    : lang === "de" ? "Letzte Live-Tests"     : "Recent Live Tests",
    recentCompare:    lang === "tr" ? "Son Karşılaştırmalar" : lang === "de" ? "Letzte Vergleiche"     : "Recent Comparisons",
    recentVisual:     lang === "tr" ? "Son Görsel Testler"   : lang === "de" ? "Letzte Visuelle Tests" : "Recent Visual Tests",
    recentAnalytics:  lang === "tr" ? "Son Analizler"        : lang === "de" ? "Letzte Analysen"       : "Recent Analytics",
    recordedSessions: lang === "tr" ? "Kaydedilmiş Oturumlar" : lang === "de" ? "Aufgezeichnete Sitzungen" : "Recorded Sessions",
    gridNodes:        lang === "tr" ? "Grid Düğümleri"       : lang === "de" ? "Grid-Knoten"           : "Grid Nodes",
  },

  selenium: {
    totalNodes: lang === "tr" ? "Toplam Düğüm" : lang === "de" ? "Gesamtknoten" : "Total Nodes",
    active:     lang === "tr" ? "Aktif"         : lang === "de" ? "Aktiv"        : "Active",
    offline:    lang === "tr" ? "Çevrimdışı"   : lang === "de" ? "Offline"      : "Offline",
    node:       lang === "tr" ? "Düğüm"        : lang === "de" ? "Knoten"       : "Node",
    browser:    lang === "tr" ? "Tarayıcı"     : lang === "de" ? "Browser"      : "Browser",
    os:         lang === "tr" ? "İşletim Sistemi" : lang === "de" ? "Betriebssystem" : "OS",
    sessions:   lang === "tr" ? "Oturumlar"   : lang === "de" ? "Sitzungen"    : "Sessions",
    status:     lang === "tr" ? "Durum"        : lang === "de" ? "Status"       : "Status",
  },

  recorder: {
    steps:    lang === "tr" ? "adım"       : lang === "de" ? "Schritte"   : "steps",
    lastRun:  lang === "tr" ? "Son çalışma" : lang === "de" ? "Zuletzt ausgeführt" : "Last run",
  },

  footer: {
    operational: lang === "tr" ? "Tüm sistemler çalışıyor" : lang === "de" ? "Alle Systeme laufen" : "All systems operational",
  },
};

  // Modal
  //const [modalOpen, setModalOpen] = useState(false);

  const overviewCards = [
    {
      label: t.stats.totalTests,
      value: testStats.totalTests.toLocaleString(),
      deltaLabel: `${testStats.todayTests} ${t.stats.today}`,
      icon: Monitor,
      color: primary,
      bg: "#EEF2FF",
    },
    {
      label: t.stats.passed,
      value: testStats.passed.toLocaleString(),
      deltaLabel: `${t.stats.allTime}`,
      icon: CheckCircle,
      color: success,
      bg: "#EBFBEE",
    },
    {
      label: t.stats.failed,
      value: testStats.failed.toLocaleString(),
      deltaLabel: `${t.stats.allTime}`,
      icon: X,
      color: danger,
      bg: "#FFF5F5",
    },
    {
      label: t.stats.avgDuration,
      value: `${testStats.avgDuration}s`,
      deltaLabel: `${t.stats.perTest}`,
      icon: RefreshCw,
      color: warning,
      bg: "#FFF9DB",
    },
  ];

  // ── Shared URL + Resolution input block ──────────────────────────
  const UrlInput = ({ value, onChange, placeholder = "https://..." }: {
    value: string; onChange: (v: string) => void; placeholder?: string;
  }) => (
    <div className="flex-1">
      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
        {t.fields.url}
      </label>
      <div className="relative">
        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 14, height: 14 }} />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          style={{ fontFamily: "Inter, sans-serif" }}
        />
      </div>
    </div>
  );

  const ResolutionSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
        {t.fields.resolution}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {resolutions.map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>
    </div>
  );

  // ── Recent list panel ─────────────────────────────────────────────
  const RecentPanel = ({ title, count, children }: {
    title: string; count: number; children: React.ReactNode;
  }) => (
    <div className="rounded-2xl border border-gray-100 overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>{title}</h3>
        <span
          className="px-2 py-0.5 rounded-full text-xs text-white"
          style={{ backgroundColor: success, fontFamily: "Inter, sans-serif" }}
        >
          {count}
        </span>
      </div>
      {children}
    </div>
  );

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

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {overviewCards.map((card, i) => <StatCard key={i} {...card} />)}
          </div>

          {/* Main Tabs: Manual / Automated */}
          <div className="mb-6">
            <div className="flex items-center gap-2 border-b border-gray-200">
              {(["manual", "automated"] as MainTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMainTab(tab)}
                  className={`px-4 py-2.5 text-sm transition-colors relative capitalize ${
                    mainTab === tab ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                  } cursor-pointer`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {tab === "manual" ? t.mainTabs.manual : t.mainTabs.automated}
                  {mainTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: primary }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── MANUAL TESTING ─────────────────────────────────────── */}
          {mainTab === "manual" && (
            <div className="space-y-6">
              {/* Sub-tabs */}
              <div className="flex gap-1 p-1 rounded-xl bg-gray-100 w-fit">
                {([
                  { key: "live",      label: t.manualTabs.live,   Icon: Monitor    },
                  { key: "compare",   label: t.manualTabs.compare, Icon: GitCompare },
                  { key: "visual",    label: t.manualTabs.visual, Icon: Camera     },
                  { key: "analytics", label: t.manualTabs.analytics, Icon: BarChart2  },
                ] as { key: ManualTab; label: string; Icon: any }[]).map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    onClick={() => setManualTab(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                      manualTab === key
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <Icon style={{ width: 14, height: 14 }} />
                    {label}
                  </button>
                ))}
              </div>

              {/* ── Live Testing ── */}
              {manualTab === "live" && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-gray-100 p-5" style={{ backgroundColor: "#ffffff" }}>
                    <h2 className="text-sm text-gray-700 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.panels.liveConfig}
                    </h2>
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                      <UrlInput value={liveUrl} onChange={setLiveUrl} />
                      <ResolutionSelect value={liveResolution} onChange={setLiveResolution} />
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                          {t.fields.browser}
                        </label>
                        <BrowserSelector selected={liveBrowser} onChange={setLiveBrowser} multi={false} />
                      </div>
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white shrink-0 cursor-pointer"
                        style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                      >
                        <Play style={{ width: 14, height: 14 }} />
                        {t.actions.runTest}
                      </button>
                    </div>
                  </div>

                  <RecentPanel title={t.panels.recentLive} count={recentLiveTests.length}>
                    {recentLiveTests.map((t) => (
                      <TestCard
                        key={t.id}
                        url={t.url}
                        meta={`${t.browser} · ${t.resolution} · ${t.duration}`}
                        status={t.status}
                        timestamp={t.timestamp}
                      />
                    ))}
                  </RecentPanel>
                </div>
              )}

              {/* ── Compare ── */}
              {manualTab === "compare" && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-gray-100 p-5" style={{ backgroundColor: "#ffffff" }}>
                    <h2 className="text-sm text-gray-700 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.panels.crossBrowser}
                    </h2>
                    <div className="space-y-4">
                      <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <UrlInput value={compareUrl} onChange={setCompareUrl} />
                        <ResolutionSelect value={compareResolution} onChange={setCompareResolution} />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                          {t.fields.compareBrowsers}
                        </label>
                        <BrowserSelector selected={compareBrowsers} onChange={setCompareBrowsers} multi={true} />
                      </div>
                      <div className="flex justify-end">
                        <button
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white cursor-pointer"
                          style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                        >
                          <GitCompare style={{ width: 14, height: 14 }} />
                          {t.actions.runComparison}
                        </button>
                      </div>
                    </div>
                  </div>

                  <RecentPanel title={t.panels.recentCompare} count={recentCompareTests.length}>
                    {recentCompareTests.map((t) => (
                      <TestCard
                        key={t.id}
                        url={t.url}
                        meta={`${t.browsers.join(" vs ")} · ${t.resolution}`}
                        status={t.status}
                        timestamp={t.timestamp}
                      />
                    ))}
                  </RecentPanel>
                </div>
              )}

              {/* ── Visual Testing ── */}
              {manualTab === "visual" && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-gray-100 p-5" style={{ backgroundColor: "#ffffff" }}>
                    <h2 className="text-sm text-gray-700 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.panels.visualConfig}
                    </h2>
                    <div className="space-y-4">
                      <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <UrlInput value={visualUrl} onChange={setVisualUrl} />
                        <ResolutionSelect value={visualResolution} onChange={setVisualResolution} />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                          {t.fields.browsers}
                        </label>
                        <BrowserSelector selected={visualBrowsers} onChange={setVisualBrowsers} multi={true} />
                      </div>
                      <div className="flex justify-end">
                        <button
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white cursor-pointer"
                          style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                        >
                          <Camera style={{ width: 14, height: 14 }} />
                          {t.actions.generateScreenshots}
                        </button>
                      </div>
                    </div>
                  </div>

                  <RecentPanel title={t.panels.recentVisual} count={recentVisualTests.length}>
                    {recentVisualTests.map((t) => (
                      <TestCard
                        key={t.id}
                        url={t.url}
                        meta={`${t.browsers.join(", ")} · ${t.resolution}`}
                        status={t.status}
                        timestamp={t.timestamp}
                        extra={`${t.screenshots} screenshot${t.screenshots > 1 ? "s" : ""}`}
                      />
                    ))}
                  </RecentPanel>
                </div>
              )}

              {/* ── Page Analytics ── */}
              {manualTab === "analytics" && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-gray-100 p-5" style={{ backgroundColor: "#ffffff" }}>
                    <h2 className="text-sm text-gray-700 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.panels.analyticsConfig}
                    </h2>
                    <div className="space-y-4">
                      <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <UrlInput value={analyticsUrl} onChange={setAnalyticsUrl} />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                          {t.fields.browsers}
                        </label>
                        <BrowserSelector selected={analyticsBrowsers} onChange={setAnalyticsBrowsers} multi={true} />
                      </div>
                      <div className="flex justify-end">
                        <button
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white cursor-pointer"
                          style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                        >
                          <BarChart2 style={{ width: 14, height: 14 }} />
                          {t.actions.generateAnalytics}
                        </button>
                      </div>
                    </div>
                  </div>

                  <RecentPanel title={t.panels.recentAnalytics} count={recentPageAnalytics.length}>
                    {recentPageAnalytics.map((t) => (
                      <TestCard
                        key={t.id}
                        url={t.url}
                        meta={t.browsers.join(", ")}
                        status={t.status}
                        timestamp={t.timestamp}
                        extra={`LCP ${t.lcp} · FCP ${t.fcp} · CLS ${t.cls}`}
                      />
                    ))}
                  </RecentPanel>
                </div>
              )}
            </div>
          )}

          {/* ── AUTOMATED TESTING ──────────────────────────────────── */}
          {mainTab === "automated" && (
            <div className="space-y-6">
              {/* Sub-tabs */}
              <div className="flex gap-1 p-1 rounded-xl bg-gray-100 w-fit">
                {([
                  { key: "recorder", label: t.autoTabs.recorder, Icon: Circle  },
                  { key: "selenium", label: t.autoTabs.selenium, Icon: Server  },
                ] as { key: AutoTab; label: string; Icon: any }[]).map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    onClick={() => setAutoTab(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                      autoTab === key
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <Icon style={{ width: 14, height: 14 }} />
                    {label}
                  </button>
                ))}
              </div>

              {/* ── Test Recorder ── */}
              {autoTab === "recorder" && (
                <div className="space-y-5">
                  <div className="flex justify-end">
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white cursor-pointer"
                      style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                    >
                      <Plus style={{ width: 14, height: 14 }} />
                      {t.actions.newRecording}
                    </button>
                  </div>

                  <div className="rounded-2xl border border-gray-100 overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                      <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.panels.recordedSessions}
                      </h2>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs text-white"
                        style={{ backgroundColor: success, fontFamily: "Inter, sans-serif" }}
                      >
                        {recorderSessions.length}
                      </span>
                    </div>

                    {recorderSessions.map((s) => (
                      <div key={s.id} className="px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>{s.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                            {s.steps} steps · Last run: {new Date(s.lastRun).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                        <StatusBadge status={s.status} />
                        <div className="flex items-center gap-2">
                          <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 cursor-pointer"
                          >
                            <Play style={{ width: 14, height: 14 }} />
                          </button>
                          <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 cursor-pointer"
                          >
                            <Settings style={{ width: 14, height: 14 }} />
                          </button>
                          <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors text-red-400 cursor-pointer"
                          >
                            <Trash2 style={{ width: 14, height: 14 }} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Selenium Grid ── */}
              {autoTab === "selenium" && (
                <div className="space-y-5">
                  {/* Grid summary */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: t.selenium.totalNodes , value: seleniumGridNodes.length, color: primary },
                      { label: t.selenium.active, value: seleniumGridNodes.filter(n => n.status === "active").length, color: success },
                      { label: t.selenium.offline, value: seleniumGridNodes.filter(n => n.status === "offline").length, color: danger  },
                    ].map((item, i) => (
                      <div key={i} className="rounded-2xl border border-gray-100 p-4" style={{ backgroundColor: "#ffffff" }}>
                        <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>{item.label}</p>
                        <p className="text-2xl font-semibold" style={{ color: item.color, fontFamily: "Inter, sans-serif" }}>
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Node table */}
                  <div className="rounded-2xl border border-gray-100 overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
                    <div className="px-5 py-4 border-b border-gray-100">
                      <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>Grid Nodes</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-100">
                            {[t.selenium.node, t.selenium.browser, t.selenium.os, t.selenium.sessions, t.selenium.status].map((h) => (
                              <th key={h} className="px-5 py-3 text-left text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {seleniumGridNodes.map((node) => (
                            <tr key={node.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                              <td className="px-5 py-4 text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>{node.name}</td>
                              <td className="px-5 py-4 text-sm text-gray-600" style={{ fontFamily: "Inter, sans-serif" }}>{node.browser}</td>
                              <td className="px-5 py-4 text-sm text-gray-600" style={{ fontFamily: "Inter, sans-serif" }}>{node.os}</td>
                              <td className="px-5 py-4 text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>{node.sessions}</td>
                              <td className="px-5 py-4"><StatusBadge status={node.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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
            {t.footer.operational}
          </div>
        </footer>
      </div>
    </div>
  );
}