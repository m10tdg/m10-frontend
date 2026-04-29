// Mock data for System Settings

export const systemSettings = {
  general: {
    platformName: "M10 Platform",
    tagline: "Quality Assurance & Testing",
    timezone: "America/Los_Angeles",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    defaultLanguage: "en",
    maintenanceMode: false,
  },
  security: {
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    passwordExpiryDays: 90,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    force2FA: false,
    allowedIPs: [],
    trustedDomains: ["m10platform.com", "m10.io"],
  },
  api: {
    enabled: true,
    rateLimitPerMinute: 100,
    rateLimitPerHour: 1000,
    rateLimitPerDay: 10000,
    requireApiKey: true,
    allowCORS: true,
    allowedOrigins: ["https://app.m10platform.com", "https://dashboard.m10platform.com"],
    webhookTimeout: 30,
    retryAttempts: 3,
  },
};

export const apiKeys = [
  {
    id: 1,
    name: "Production API Key",
    key: "mk_live_••••••••••••••••••••",
    created: "2024-01-15",
    lastUsed: "2 hours ago",
    permissions: ["read", "write", "execute"],
    status: "active",
  },
  {
    id: 2,
    name: "CI/CD Pipeline",
    key: "mk_live_••••••••••••••••••••",
    created: "2024-02-20",
    lastUsed: "5 minutes ago",
    permissions: ["read", "execute"],
    status: "active",
  },
  {
    id: 3,
    name: "Development Testing",
    key: "mk_test_••••••••••••••••••••",
    created: "2024-03-10",
    lastUsed: "1 day ago",
    permissions: ["read"],
    status: "active",
  },
  {
    id: 4,
    name: "Legacy Integration",
    key: "mk_live_••••••••••••••••••••",
    created: "2023-11-05",
    lastUsed: "Never",
    permissions: ["read", "write"],
    status: "inactive",
  },
];

export const systemHealth = {
  status: "healthy",
  uptime: "99.98%",
  lastRestart: "2025-04-01T02:00:00Z",
  services: [
    { name: "API Gateway", status: "healthy", responseTime: 45 },
    { name: "Database", status: "healthy", responseTime: 12 },
    { name: "Test Runner", status: "healthy", responseTime: 234 },
    { name: "File Storage", status: "warning", responseTime: 156 },
    { name: "Scheduler", status: "healthy", responseTime: 23 },
  ],
  resources: {
    cpu: 45,
    memory: 67,
    disk: 82,
    network: 34,
  },
};

export const timezones = [
  "America/Los_Angeles",
  "America/New_York",
  "Europe/London",
  "Europe/Paris",
  "Europe/Istanbul",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
];

export const languages = [
  { code: "en", name: "English" },
  { code: "tr", name: "Türkçe" },
  { code: "de", name: "Deutsch" },
];