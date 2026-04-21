import { primary, success, warning } from "@/shared/styles/colors";

export const trendData = [
  { day: "Apr 3", passed: 42, failed: 5, running: 3 },
  { day: "Apr 4", passed: 55, failed: 8, running: 2 },
  { day: "Apr 5", passed: 38, failed: 12, running: 5 },
  { day: "Apr 6", passed: 60, failed: 4, running: 1 },
  { day: "Apr 7", passed: 71, failed: 7, running: 4 },
  { day: "Apr 8", passed: 65, failed: 9, running: 6 },
  { day: "Apr 9", passed: 48, failed: 3, running: 2 },
  { day: "Apr 10", passed: 80, failed: 6, running: 3 },
  { day: "Apr 11", passed: 92, failed: 11, running: 8 },
  { day: "Apr 12", passed: 74, failed: 5, running: 2 },
  { day: "Apr 13", passed: 66, failed: 14, running: 7 },
  { day: "Apr 14", passed: 88, failed: 3, running: 4 },
  { day: "Apr 15", passed: 95, failed: 8, running: 5 },
  { day: "Apr 16", passed: 78, failed: 9, running: 11 },
];

export const recentTests = [
  { id: "T-4821", name: "Homepage Visual Regression", type: "Visual", status: "passed", duration: "2m 14s", env: "Chrome 124", time: "3 min ago", branch: "main" },
  { id: "T-4820", name: "Login Flow E2E", type: "Live", status: "failed", duration: "1m 45s", env: "Firefox 123", time: "8 min ago", branch: "feature/auth" },
  { id: "T-4819", name: "API Load Test – 500 Users", type: "Performance", status: "running", duration: "running…", env: "Chrome 124", time: "12 min ago", branch: "main" },
  { id: "T-4818", name: "Checkout Page Analysis", type: "Page Analysis", status: "passed", duration: "0m 48s", env: "Edge 124", time: "27 min ago", branch: "hotfix/cart" },
  { id: "T-4817", name: "Mobile Navigation WCAG", type: "Accessibility", status: "passed", duration: "3m 02s", env: "Safari 17", time: "1h ago", branch: "main" },
  { id: "T-4816", name: "Dashboard Visual Diff", type: "Visual", status: "failed", duration: "1m 30s", env: "Chrome 124", time: "2h ago", branch: "design/v2" },
  { id: "T-4815", name: "Search Performance Benchmark", type: "Performance", status: "pending", duration: "—", env: "Chrome 124", time: "2h ago", branch: "main" },
];

export const environments = [
  { name: "Chrome 124", status: "busy", executors: 4, total: 4, location: "EU-West" },
  { name: "Firefox 123", status: "idle", executors: 0, total: 3, location: "EU-West" },
  { name: "Safari 17", status: "idle", executors: 0, total: 2, location: "US-East" },
  { name: "Edge 124", status: "busy", executors: 2, total: 3, location: "EU-West" },
  { name: "Mobile Agent", status: "offline", executors: 0, total: 2, location: "US-East" },
  { name: "Perf Cluster", status: "busy", executors: 8, total: 8, location: "EU-Central" },
];

export const notifications = [
  { id: 1, type: "error", title: "Test Runner Disconnected", message: "Mobile Agent went offline unexpectedly. 3 queued tests affected.", time: "2 min ago", read: false },
  { id: 2, type: "warning", title: "High Failure Rate Detected", message: "Login Flow E2E has failed 5 times consecutively on Firefox 123.", time: "8 min ago", read: false },
  { id: 3, type: "warning", title: "License Threshold Warning", message: "You have used 87% of your monthly test execution quota.", time: "1h ago", read: false },
  { id: 4, type: "success", title: "CI/CD Pipeline Passed", message: "GitHub Actions integration completed successfully for main branch.", time: "2h ago", read: true },
  { id: 5, type: "info", title: "New User Registered", message: "Marcus Weber joined as Test Engineer. Role assignment pending.", time: "3h ago", read: true },
  { id: 6, type: "info", title: "System Update Available", message: "M10 Platform v2.4.1 is available. Schedule maintenance window.", time: "1d ago", read: true },
];

export const topUsers = [
  { name: "Elif Çelik", role: "Test Engineer", avatar: "EÇ", tests: 142, color: primary },
  { name: "Marcus Weber", role: "Developer", avatar: "MW", tests: 98, color: "#7048E8" },
  { name: "Sarah Mitchell", role: "Manual Tester", avatar: "SM", tests: 76, color: success },
  { name: "Ali Yıldız", role: "Test Engineer", avatar: "AY", tests: 63, color: warning },
];