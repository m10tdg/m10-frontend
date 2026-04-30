// entities/testEnvironments/data.ts


export const testStats = {
  totalTests: 1284,
  todayTests: 47,
  passed: 1101,
  failed: 183,
  avgDuration: 3.4, // seconds
};

export const browsers = [
  { value: "chrome",  label: "Chrome",  icon: "🟢" },
  { value: "firefox", label: "Firefox", icon: "🟠" },
  { value: "safari",  label: "Safari",  icon: "🔵" },
  { value: "edge",    label: "Edge",    icon: "🟣" },
];

export const resolutions = [
  { value: "1920x1080", label: "1920×1080 (FHD)" },
  { value: "1440x900",  label: "1440×900 (WXGA+)" },
  { value: "1280x800",  label: "1280×800" },
  { value: "768x1024",  label: "768×1024 (iPad)" },
  { value: "390x844",   label: "390×844 (iPhone 14)" },
];

export const recentLiveTests = [
  {
    id: 1,
    url: "https://app.m10.io/dashboard",
    browser: "Chrome",
    resolution: "1920x1080",
    status: "passed",
    duration: "2.1s",
    timestamp: "2026-04-30T10:22:00Z",
  },
  {
    id: 2,
    url: "https://app.m10.io/login",
    browser: "Firefox",
    resolution: "1280x800",
    status: "failed",
    duration: "5.8s",
    timestamp: "2026-04-30T09:45:00Z",
  },
  // add 2-3 more as needed
];

export const recentCompareTests = [
  {
    id: 1,
    url: "https://app.m10.io/pricing",
    browsers: ["Chrome", "Safari", "Firefox"],
    resolution: "1440x900",
    status: "passed",
    timestamp: "2026-04-30T08:30:00Z",
  },
];

export const recentVisualTests = [
  {
    id: 1,
    url: "https://app.m10.io/home",
    browsers: ["Chrome", "Edge"],
    resolution: "1920x1080",
    screenshots: 2,
    status: "passed",
    timestamp: "2026-04-29T18:00:00Z",
  },
];

export const recentPageAnalytics = [
  {
    id: 1,
    url: "https://app.m10.io/dashboard",
    browsers: ["Chrome"],
    lcp: "1.2s",
    fcp: "0.8s",
    cls: "0.01",
    status: "passed",
    timestamp: "2026-04-29T17:00:00Z",
  },
];

export const recorderSessions = [
  {
    id: 1,
    name: "Login Flow",
    steps: 8,
    status: "ready",
    lastRun: "2026-04-30T08:00:00Z",
  },
  {
    id: 2,
    name: "Checkout Flow",
    steps: 14,
    status: "running",
    lastRun: "2026-04-30T10:00:00Z",
  },
];

export const seleniumGridNodes = [
  { id: 1, name: "Node 1", browser: "Chrome 124",  os: "Ubuntu 22.04", status: "active",  sessions: 3 },
  { id: 2, name: "Node 2", browser: "Firefox 125", os: "Ubuntu 22.04", status: "active",  sessions: 1 },
  { id: 3, name: "Node 3", browser: "Edge 124",    os: "Windows 11",   status: "idle",    sessions: 0 },
  { id: 4, name: "Node 4", browser: "Safari 17",   os: "macOS 14",     status: "offline", sessions: 0 },
];