// pages/testEnvironments/TestEnvironments.tsx

import { useState } from "react";
import {
  Monitor, GitCompare, Camera, BarChart2,
  Play, Circle, Server, Plus, RefreshCw,
  Globe, Settings, X, Eye, Trash2, CheckCircle,
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

  // Modal
  const [modalOpen, setModalOpen] = useState(false);

  const overviewCards = [
    {
      label: "Total Tests",
      value: testStats.totalTests.toLocaleString(),
      deltaLabel: `${testStats.todayTests} today`,
      icon: Monitor,
      color: primary,
      bg: "#EEF2FF",
    },
    {
      label: "Passed",
      value: testStats.passed.toLocaleString(),
      deltaLabel: "all time",
      icon: CheckCircle,
      color: success,
      bg: "#EBFBEE",
    },
    {
      label: "Failed",
      value: testStats.failed.toLocaleString(),
      deltaLabel: "all time",
      icon: X,
      color: danger,
      bg: "#FFF5F5",
    },
    {
      label: "Avg Duration",
      value: `${testStats.avgDuration}s`,
      deltaLabel: "per test",
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
        URL
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
        Resolution
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
              Test Environments
            </h1>
            <p className="text-sm text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
              Run manual and automated tests across browsers and devices
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
                  {tab === "manual" ? "Manual Testing" : "Automated Testing"}
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
                  { key: "live",      label: "Live Testing",   Icon: Monitor    },
                  { key: "compare",   label: "Compare",        Icon: GitCompare },
                  { key: "visual",    label: "Visual Testing", Icon: Camera     },
                  { key: "analytics", label: "Page Analytics", Icon: BarChart2  },
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
                      Live Testing Configuration
                    </h2>
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                      <UrlInput value={liveUrl} onChange={setLiveUrl} />
                      <ResolutionSelect value={liveResolution} onChange={setLiveResolution} />
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                          Browser
                        </label>
                        <BrowserSelector selected={liveBrowser} onChange={setLiveBrowser} multi={false} />
                      </div>
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white shrink-0 cursor-pointer"
                        style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                      >
                        <Play style={{ width: 14, height: 14 }} />
                        Run Test
                      </button>
                    </div>
                  </div>

                  <RecentPanel title="Recent Live Tests" count={recentLiveTests.length}>
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
                      Cross-Browser Comparison
                    </h2>
                    <div className="space-y-4">
                      <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <UrlInput value={compareUrl} onChange={setCompareUrl} />
                        <ResolutionSelect value={compareResolution} onChange={setCompareResolution} />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                          Select Browsers to Compare (select 2 or more)
                        </label>
                        <BrowserSelector selected={compareBrowsers} onChange={setCompareBrowsers} multi={true} />
                      </div>
                      <div className="flex justify-end">
                        <button
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white cursor-pointer"
                          style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                        >
                          <GitCompare style={{ width: 14, height: 14 }} />
                          Run Comparison
                        </button>
                      </div>
                    </div>
                  </div>

                  <RecentPanel title="Recent Comparisons" count={recentCompareTests.length}>
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
                      Visual Testing & Screenshots
                    </h2>
                    <div className="space-y-4">
                      <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <UrlInput value={visualUrl} onChange={setVisualUrl} />
                        <ResolutionSelect value={visualResolution} onChange={setVisualResolution} />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                          Select Browsers
                        </label>
                        <BrowserSelector selected={visualBrowsers} onChange={setVisualBrowsers} multi={true} />
                      </div>
                      <div className="flex justify-end">
                        <button
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white cursor-pointer"
                          style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                        >
                          <Camera style={{ width: 14, height: 14 }} />
                          Generate Screenshots
                        </button>
                      </div>
                    </div>
                  </div>

                  <RecentPanel title="Recent Visual Tests" count={recentVisualTests.length}>
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
                      Page Analytics — Core Web Vitals
                    </h2>
                    <div className="space-y-4">
                      <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <UrlInput value={analyticsUrl} onChange={setAnalyticsUrl} />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                          Select Browsers
                        </label>
                        <BrowserSelector selected={analyticsBrowsers} onChange={setAnalyticsBrowsers} multi={true} />
                      </div>
                      <div className="flex justify-end">
                        <button
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white cursor-pointer"
                          style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                        >
                          <BarChart2 style={{ width: 14, height: 14 }} />
                          Generate Analytics
                        </button>
                      </div>
                    </div>
                  </div>

                  <RecentPanel title="Recent Analytics" count={recentPageAnalytics.length}>
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
                  { key: "recorder", label: "Test Recorder", Icon: Circle  },
                  { key: "selenium", label: "Selenium Grid", Icon: Server  },
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
                      New Recording
                    </button>
                  </div>

                  <div className="rounded-2xl border border-gray-100 overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                      <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                        Recorded Sessions
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
                      { label: "Total Nodes", value: seleniumGridNodes.length, color: primary },
                      { label: "Active",  value: seleniumGridNodes.filter(n => n.status === "active").length,  color: success },
                      { label: "Offline", value: seleniumGridNodes.filter(n => n.status === "offline").length, color: danger  },
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
                            {["Node", "Browser", "OS", "Sessions", "Status"].map((h) => (
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
            All systems operational
          </div>
        </footer>
      </div>
    </div>
  );
}