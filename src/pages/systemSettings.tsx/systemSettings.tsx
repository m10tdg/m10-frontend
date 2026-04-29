import { useEffect, useState } from "react";
import {
  Globe,
  Shield,
  Code,
  HardDrive,
  Save,
  AlertTriangle,
  CheckCircle2,
  Server,
  Activity,
  Cpu,
  MemoryStick,
  Wifi,
  Plus,
  Trash2,
  Copy,
  Check,
  X
} from "lucide-react";

import { AdminSidebar } from "@/shared/ui/admin/components/AdminSidebar";
import { TopBar } from "@/shared/ui/admin/components/TopBar";

import { useLangStore } from "@/shared/stores/langStore";
import { primary, danger, warning, success, bg } from "@/shared/styles/colors";
import {
  systemSettings as initialSettings,
  apiKeys as initialApiKeys,
  systemHealth,
  timezones,
  languages,
} from "@/entities/systemSettings";

type SettingsSection =
  | "general"
  | "security"
  | "api"
  | "health";

type ModalType = "addApiKey" | "deleteApiKey" | null;

type SystemSettingsFormData = {
  // API Key
  name: string;
  key: string;
};

const initialFormData: SystemSettingsFormData = {
  name: "",
  key: ""
};

type ApiKey = {
    id: number;
    name: string;
    key: string;
    created: string;
    lastUsed: string;
    permissions: string[];
    status: string;
};

export function SystemSettings() {
  const { lang } = useLangStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);

  // State
  const [settings, setSettings] = useState(initialSettings);
  const [apiKeys] = useState(initialApiKeys);
  const [activeSection, setActiveSection] = useState<SettingsSection>("general");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [copiedKey, setCopiedKey] = useState<number | null>(null);
  const [formData, setFormData] = useState<SystemSettingsFormData>(initialFormData);
  const [currentApiKey, setCurrentApiKey] = useState<ApiKey | null>(null);

  const t = {
    pageTitle: lang === "tr" ? "Sistem Ayarları" : lang === "de" ? "Systemeinstellungen" : "System Settings",
    pageSubtitle:
      lang === "tr"
        ? "Platform yapılandırmasını ve sistem ayarlarını yönetin"
        : lang === "de"
        ? "Verwalten Sie Plattformkonfiguration und Systemeinstellungen"
        : "Manage platform configuration and system preferences",
    sections: {
      general: lang === "tr" ? "Genel" : lang === "de" ? "Allgemein" : "General",
      security: lang === "tr" ? "Güvenlik" : lang === "de" ? "Sicherheit" : "Security",
      api: lang === "tr" ? "API" : lang === "de" ? "API" : "API",
      health: lang === "tr" ? "Sistem Sağlığı" : lang === "de" ? "Systemzustand" : "System Health",
    },
    actions: {
      save: lang === "tr" ? "Değişiklikleri Kaydet" : lang === "de" ? "Änderungen speichern" : "Save Changes",
      cancel: lang === "tr" ? "İptal" : lang === "de" ? "Abbrechen" : "Cancel",
      reset: lang === "tr" ? "Sıfırla" : lang === "de" ? "Zurücksetzen" : "Reset",
      add: lang === "tr" ? "Ekle" : lang === "de" ? "Hinzufügen" : "Add",
      delete: lang === "tr" ? "Sil" : lang === "de" ? "Löschen" : "Delete",
      edit: lang === "tr" ? "Düzenle" : lang === "de" ? "Bearbeiten" : "Edit",
      test: lang === "tr" ? "Test Et" : lang === "de" ? "Testen" : "Test",
      copy: lang === "tr" ? "Kopyala" : lang === "de" ? "Kopieren" : "Copy",
      copied: lang === "tr" ? "Kopyalandı" : lang === "de" ? "Kopiert" : "Copied",
    },
    general: {
      platformName: lang === "tr" ? "Platform Adı" : lang === "de" ? "Plattformname" : "Platform Name",
      tagline: lang === "tr" ? "Slogan" : lang === "de" ? "Slogan" : "Tagline",
      timezone: lang === "tr" ? "Saat Dilimi" : lang === "de" ? "Zeitzone" : "Timezone",
      dateFormat: lang === "tr" ? "Tarih Formatı" : lang === "de" ? "Datumsformat" : "Date Format",
      timeFormat: lang === "tr" ? "Saat Formatı" : lang === "de" ? "Zeitformat" : "Time Format",
      language: lang === "tr" ? "Varsayılan Dil" : lang === "de" ? "Standardsprache" : "Default Language",
      maintenance: lang === "tr" ? "Bakım Modu" : lang === "de" ? "Wartungsmodus" : "Maintenance Mode",
    },
    security: {
      title: lang === "tr" ? "Güvenlik Ayarları" : lang === "de" ? "Sicherheitseinstellungen" : "Security Settings",
      passwordPolicy: lang === "tr" ? "Şifre Politikası" : lang === "de" ? "Passwortrichtlinie" : "Password Policy",
      minLength: lang === "tr" ? "Min. Uzunluk" : lang === "de" ? "Min. Länge" : "Min Length",
      requireUppercase: lang === "tr" ? "Büyük Harf Gerekli" : lang === "de" ? "Großbuchstaben erforderlich" : "Require Uppercase",
      requireLowercase: lang === "tr" ? "Küçük Harf Gerekli" : lang === "de" ? "Kleinbuchstaben erforderlich" : "Require Lowercase",
      requireNumbers: lang === "tr" ? "Rakam Gerekli" : lang === "de" ? "Zahlen erforderlich" : "Require Numbers",
      requireSpecial: lang === "tr" ? "Özel Karakter Gerekli" : lang === "de" ? "Sonderzeichen erforderlich" : "Require Special Chars",
      expiryDays: lang === "tr" ? "Şifre Geçerlilik (gün)" : lang === "de" ? "Passwortgültigkeit (Tage)" : "Password Expiry (days)",
      sessionTimeout: lang === "tr" ? "Oturum Zaman Aşımı (dk)" : lang === "de" ? "Sitzungstimeout (Min)" : "Session Timeout (min)",
      maxAttempts: lang === "tr" ? "Maks. Giriş Denemesi" : lang === "de" ? "Max. Login-Versuche" : "Max Login Attempts",
      lockoutDuration: lang === "tr" ? "Kilitleme Süresi (dk)" : lang === "de" ? "Sperrfrist (Min)" : "Lockout Duration (min)",
      force2FA: lang === "tr" ? "2FA Zorunlu" : lang === "de" ? "2FA erzwingen" : "Force 2FA",
    },
    api: {
      title: lang === "tr" ? "API Ayarları" : lang === "de" ? "API-Einstellungen" : "API Settings",
      enabled: lang === "tr" ? "API Etkin" : lang === "de" ? "API aktiviert" : "API Enabled",
      rateLimit: lang === "tr" ? "Oran Limiti" : lang === "de" ? "Ratenbegrenzung" : "Rate Limiting",
      perMinute: lang === "tr" ? "Dakika başına" : lang === "de" ? "Pro Minute" : "Per Minute",
      perHour: lang === "tr" ? "Saat başına" : lang === "de" ? "Pro Stunde" : "Per Hour",
      perDay: lang === "tr" ? "Gün başına" : lang === "de" ? "Pro Tag" : "Per Day",
      keys: lang === "tr" ? "API Anahtarları" : lang === "de" ? "API-Schlüssel" : "API Keys",
      addKey: lang === "tr" ? "Anahtar Ekle" : lang === "de" ? "Schlüssel hinzufügen" : "Add Key",
    },
    health: {
      title: lang === "tr" ? "Sistem Sağlığı" : lang === "de" ? "Systemzustand" : "System Health",
      status: lang === "tr" ? "Durum" : lang === "de" ? "Status" : "Status",
      uptime: lang === "tr" ? "Çalışma Süresi" : lang === "de" ? "Betriebszeit" : "Uptime",
      services: lang === "tr" ? "Servisler" : lang === "de" ? "Dienste" : "Services",
      resources: lang === "tr" ? "Kaynaklar" : lang === "de" ? "Ressourcen" : "Resources",
      healthy: lang === "tr" ? "Sağlıklı" : lang === "de" ? "Gesund" : "Healthy",
      warning: lang === "tr" ? "Uyarı" : lang === "de" ? "Warnung" : "Warning",
      critical: lang === "tr" ? "Kritik" : lang === "de" ? "Kritisch" : "Critical",
    },
  };

  useEffect(() => {
  if (modalType === "addApiKey") {
    setFormData({
      ...initialFormData,
    });
  }
}, [modalType]);

  const handleSaveSettings = () => {
    // Save logic here
    setHasChanges(false);
  };

  const handleResetSettings = () => {
    setSettings(initialSettings);
    setHasChanges(false);
  };

  const handleCopyKey = (id: number) => {
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenModal = (type: ModalType) => {
    setModalType(type);
  };

  const handleCloseModal = () => {
  setModalType(null);
  setCurrentApiKey(null);
  };

  const settingsSections = [
    { id: "general", icon: Globe, label: t.sections.general },
    { id: "security", icon: Shield, label: t.sections.security },
    { id: "api", icon: Code, label: t.sections.api },
    { id: "health", icon: Activity, label: t.sections.health },
  ];

    function handleDeleteApiKey() {
        throw new Error("Function not implemented.");
    }

    function handleSave(){
        throw new Error("Function not implemented.");
    }

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

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Settings Navigation */}
            <div className="xl:col-span-1">
              <div className="rounded-2xl border border-gray-100 overflow-hidden sticky top-6" style={{ backgroundColor: "#ffffff" }}>
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                    {lang === "tr" ? "Ayar Kategorileri" : lang === "de" ? "Einstellungskategorien" : "Settings Categories"}
                  </h2>
                </div>
                <div className="p-2">
                  {settingsSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id as SettingsSection)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          activeSection === section.id
                            ? "text-white"
                            : "text-gray-700 hover:bg-gray-50"
                        } cursor-pointer`}
                        style={{
                          backgroundColor: activeSection === section.id ? primary : "transparent",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        <Icon style={{ width: "16px", height: "16px" }} />
                        {section.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Settings Content */}
            <div className="xl:col-span-3 space-y-6">
              {/* Save Bar */}
              {hasChanges && (
                <div
                  className="rounded-2xl border p-4 flex items-center justify-between"
                  style={{ backgroundColor: "#FFF9DB", borderColor: "#FFE8A3" }}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle style={{ width: "18px", height: "18px", color: warning }} />
                    <p className="text-sm" style={{ color: warning, fontFamily: "Inter, sans-serif" }}>
                      {lang === "tr" ? "Kaydedilmemiş değişiklikler var" : lang === "de" ? "Nicht gespeicherte Änderungen" : "You have unsaved changes"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleResetSettings}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {t.actions.cancel}
                    </button>
                    <button
                      onClick={handleSaveSettings}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white cursor-pointer"
                      style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                    >
                      <Save style={{ width: "16px", height: "16px" }} />
                      {t.actions.save}
                    </button>
                  </div>
                </div>
              )}

              {/* General Settings */}
              {activeSection === "general" && (
                <div className="rounded-2xl border border-gray-100 overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.sections.general}
                    </h2>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                          {t.general.platformName}
                        </label>
                        <input
                          type="text"
                          value={settings.general.platformName}
                          onChange={(e) => {
                            setSettings({
                              ...settings,
                              general: { ...settings.general, platformName: e.target.value },
                            });
                            setHasChanges(true);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                          {t.general.tagline}
                        </label>
                        <input
                          type="text"
                          value={settings.general.tagline}
                          onChange={(e) => {
                            setSettings({
                              ...settings,
                              general: { ...settings.general, tagline: e.target.value },
                            });
                            setHasChanges(true);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                          {t.general.timezone}
                        </label>
                        <select
                          value={settings.general.timezone}
                          onChange={(e) => {
                            setSettings({
                              ...settings,
                              general: { ...settings.general, timezone: e.target.value },
                            });
                            setHasChanges(true);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {timezones.map((tz) => (
                            <option key={tz} value={tz}>
                              {tz}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                          {t.general.language}
                        </label>
                        <select
                          value={settings.general.defaultLanguage}
                          onChange={(e) => {
                            setSettings({
                              ...settings,
                              general: { ...settings.general, defaultLanguage: e.target.value },
                            });
                            setHasChanges(true);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {languages.map((l) => (
                            <option key={l.code} value={l.code}>
                              {l.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                            {t.general.maintenance}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                            {lang === "tr"
                              ? "Platformu bakım moduna alın"
                              : lang === "de"
                              ? "Plattform in den Wartungsmodus versetzen"
                              : "Put the platform in maintenance mode"}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSettings({
                              ...settings,
                              general: { ...settings.general, maintenanceMode: !settings.general.maintenanceMode },
                            });
                            setHasChanges(true);
                          }}
                          className="relative w-11 h-6 rounded-full transition-colors cursor-pointer"
                          style={{ backgroundColor: settings.general.maintenanceMode ? warning : "#E5E7EB" }}
                        >
                          <span
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform"
                            style={{
                              transform: settings.general.maintenanceMode ? "translateX(20px)" : "translateX(0)",
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeSection === "security" && (
                <div className="space-y-6">
                  {/* Password Policy */}
                  <div className="rounded-2xl border border-gray-100 overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
                    <div className="px-5 py-4 border-b border-gray-100">
                      <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.security.passwordPolicy}
                      </h2>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                            {t.security.minLength}
                          </label>
                          <input
                            type="number"
                            value={settings.security.passwordMinLength}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                security: { ...settings.security, passwordMinLength: parseInt(e.target.value) },
                              });
                              setHasChanges(true);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-700 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                            {t.security.expiryDays}
                          </label>
                          <input
                            type="number"
                            value={settings.security.passwordExpiryDays}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                security: { ...settings.security, passwordExpiryDays: parseInt(e.target.value) },
                              });
                              setHasChanges(true);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        {[
                          { key: "passwordRequireUppercase", label: t.security.requireUppercase },
                          { key: "passwordRequireLowercase", label: t.security.requireLowercase },
                          { key: "passwordRequireNumbers", label: t.security.requireNumbers },
                          { key: "passwordRequireSpecialChars", label: t.security.requireSpecial },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                              {item.label}
                            </span>
                            <button
                              onClick={() => {
                                setSettings({
                                  ...settings,
                                  security: {
                                    ...settings.security,
                                    [item.key]: !settings.security[item.key as keyof typeof settings.security],
                                  },
                                });
                                setHasChanges(true);
                              }}
                              className="relative w-11 h-6 rounded-full transition-colors cursor-pointer"
                              style={{
                                backgroundColor: settings.security[item.key as keyof typeof settings.security]
                                  ? success
                                  : "#E5E7EB",
                              }}
                            >
                              <span
                                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform"
                                style={{
                                  transform: settings.security[item.key as keyof typeof settings.security]
                                    ? "translateX(20px)"
                                    : "translateX(0)",
                                }}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Session & Access */}
                  <div className="rounded-2xl border border-gray-100 overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
                    <div className="px-5 py-4 border-b border-gray-100">
                      <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                        {lang === "tr" ? "Oturum & Erişim" : lang === "de" ? "Sitzung & Zugriff" : "Session & Access"}
                      </h2>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                            {t.security.sessionTimeout}
                          </label>
                          <input
                            type="number"
                            value={settings.security.sessionTimeout}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                security: { ...settings.security, sessionTimeout: parseInt(e.target.value) },
                              });
                              setHasChanges(true);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-700 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                            {t.security.maxAttempts}
                          </label>
                          <input
                            type="number"
                            value={settings.security.maxLoginAttempts}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                security: { ...settings.security, maxLoginAttempts: parseInt(e.target.value) },
                              });
                              setHasChanges(true);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2 border-t border-gray-100">
                        <div>
                          <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                            {t.security.force2FA}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                            {lang === "tr"
                              ? "Tüm kullanıcılar için iki faktörlü doğrulama zorunlu"
                              : lang === "de"
                              ? "Zwei-Faktor-Authentifizierung für alle Benutzer erforderlich"
                              : "Require two-factor authentication for all users"}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSettings({
                              ...settings,
                              security: { ...settings.security, force2FA: !settings.security.force2FA },
                            });
                            setHasChanges(true);
                          }}
                          className="relative w-11 h-6 rounded-full transition-colors cursor-pointer"
                          style={{ backgroundColor: settings.security.force2FA ? success : "#E5E7EB" }}
                        >
                          <span
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform"
                            style={{
                              transform: settings.security.force2FA ? "translateX(20px)" : "translateX(0)",
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* API Settings */}
              {activeSection === "api" && (
                <div className="space-y-6">
                  {/* API Configuration */}
                  <div className="rounded-2xl border border-gray-100 overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
                    <div className="px-5 py-4 border-b border-gray-100">
                      <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.api.title}
                      </h2>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                            {t.api.enabled}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                            {lang === "tr"
                              ? "API erişimini etkinleştir veya devre dışı bırak"
                              : lang === "de"
                              ? "API-Zugriff aktivieren oder deaktivieren"
                              : "Enable or disable API access"}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSettings({
                              ...settings,
                              api: { ...settings.api, enabled: !settings.api.enabled },
                            });
                            setHasChanges(true);
                          }}
                          className="relative w-11 h-6 rounded-full transition-colors cursor-pointer"
                          style={{ backgroundColor: settings.api.enabled ? success : "#E5E7EB" }}
                        >
                          <span
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform"
                            style={{
                              transform: settings.api.enabled ? "translateX(20px)" : "translateX(0)",
                            }}
                          />
                        </button>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-700 mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                          {t.api.rateLimit}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                              {t.api.perMinute}
                            </label>
                            <input
                              type="number"
                              value={settings.api.rateLimitPerMinute}
                              onChange={(e) => {
                                setSettings({
                                  ...settings,
                                  api: { ...settings.api, rateLimitPerMinute: parseInt(e.target.value) },
                                });
                                setHasChanges(true);
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                              {t.api.perHour}
                            </label>
                            <input
                              type="number"
                              value={settings.api.rateLimitPerHour}
                              onChange={(e) => {
                                setSettings({
                                  ...settings,
                                  api: { ...settings.api, rateLimitPerHour: parseInt(e.target.value) },
                                });
                                setHasChanges(true);
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                              {t.api.perDay}
                            </label>
                            <input
                              type="number"
                              value={settings.api.rateLimitPerDay}
                              onChange={(e) => {
                                setSettings({
                                  ...settings,
                                  api: { ...settings.api, rateLimitPerDay: parseInt(e.target.value) },
                                });
                                setHasChanges(true);
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* API Keys */}
                  <div className="rounded-2xl border border-gray-100 overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                      <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.api.keys}
                      </h2>
                      <button
                        onClick={() => handleOpenModal("addApiKey")}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-white cursor-pointer"
                        style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                      >
                        <Plus style={{ width: "14px", height: "14px" }} />
                        {t.api.addKey}
                      </button>
                    </div>

                    <div className="divide-y divide-gray-50">
                      {apiKeys.map((apiKey) => (
                        <div key={apiKey.id} className="p-5 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                                  {apiKey.name}
                                </p>
                                <span
                                  className="px-2 py-0.5 rounded text-xs"
                                  style={{
                                    backgroundColor: apiKey.status === "active" ? "#EBFBEE" : "#F3F4F6",
                                    color: apiKey.status === "active" ? success : "#868E96",
                                    fontFamily: "Inter, sans-serif",
                                  }}
                                >
                                  {apiKey.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <code
                                  className="text-xs px-2 py-1 rounded"
                                  style={{ backgroundColor: "#F3F4F6", fontFamily: "monospace" }}
                                >
                                  {apiKey.key}
                                </code>
                                <button
                                  onClick={() => handleCopyKey(apiKey.id)}
                                  className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-400"
                                >
                                  {copiedKey === apiKey.id ? (
                                    <Check style={{ width: "12px", height: "12px", color: success }} />
                                  ) : (
                                    <Copy style={{ width: "12px", height: "12px" }} />
                                  )}
                                </button>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span style={{ fontFamily: "Inter, sans-serif" }}>Created: {apiKey.created}</span>
                                <span style={{ fontFamily: "Inter, sans-serif" }}>Last used: {apiKey.lastUsed}</span>
                              </div>
                            </div>

                            <button
                                onClick={() => {
                                setCurrentApiKey(apiKey);
                                handleOpenModal("deleteApiKey");
                                }}
                              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 style={{ width: "14px", height: "14px" }} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* System Health */}
              {activeSection === "health" && (
                <div className="space-y-6">
                  {/* System Status */}
                  <div className="rounded-2xl border border-gray-100 p-5" style={{ backgroundColor: "#ffffff" }}>
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: "#EBFBEE" }}
                      >
                        <CheckCircle2 style={{ width: "32px", height: "32px", color: success }} />
                      </div>
                      <div>
                        <h2 className="text-lg text-gray-900 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                          {t.health.healthy}
                        </h2>
                        <p className="text-sm text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                          Uptime: {systemHealth.uptime}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl" style={{ backgroundColor: bg }}>
                        <div className="flex items-center gap-2 mb-2">
                          <Cpu style={{ width: "16px", height: "16px", color: primary }} />
                          <span className="text-xs text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                            CPU
                          </span>
                        </div>
                        <p className="text-xl text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                          {systemHealth.resources.cpu}%
                        </p>
                      </div>

                      <div className="p-4 rounded-xl" style={{ backgroundColor: bg }}>
                        <div className="flex items-center gap-2 mb-2">
                          <MemoryStick style={{ width: "16px", height: "16px", color: success }} />
                          <span className="text-xs text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                            Memory
                          </span>
                        </div>
                        <p className="text-xl text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                          {systemHealth.resources.memory}%
                        </p>
                      </div>

                      <div className="p-4 rounded-xl" style={{ backgroundColor: bg }}>
                        <div className="flex items-center gap-2 mb-2">
                          <HardDrive style={{ width: "16px", height: "16px", color: warning }} />
                          <span className="text-xs text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                            Disk
                          </span>
                        </div>
                        <p className="text-xl text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                          {systemHealth.resources.disk}%
                        </p>
                      </div>

                      <div className="p-4 rounded-xl" style={{ backgroundColor: bg }}>
                        <div className="flex items-center gap-2 mb-2">
                          <Wifi style={{ width: "16px", height: "16px", color: primary }} />
                          <span className="text-xs text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                            Network
                          </span>
                        </div>
                        <p className="text-xl text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                          {systemHealth.resources.network}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Services Status */}
                  <div className="rounded-2xl border border-gray-100 overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
                    <div className="px-5 py-4 border-b border-gray-100">
                      <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.health.services}
                      </h2>
                    </div>

                    <div className="divide-y divide-gray-50">
                      {systemHealth.services.map((service, idx) => (
                        <div key={idx} className="p-5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Server style={{ width: "16px", height: "16px", color: "#6B7280" }} />
                              <span className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                                {service.name}
                              </span>
                            </div>
                            <span
                              className="px-2 py-0.5 rounded-full text-xs flex items-center gap-1.5"
                              style={{
                                backgroundColor: service.status === "healthy" ? "#EBFBEE" : "#FFF9DB",
                                color: service.status === "healthy" ? success : warning,
                                fontFamily: "Inter, sans-serif",
                              }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: service.status === "healthy" ? success : warning }}
                              />
                              {service.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                            Response time: {service.responseTime}ms
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Continue with other sections similarly... */}
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
            {lang === "tr"
              ? "Tüm sistemler çalışıyor"
              : lang === "de"
              ? "Alle Systeme laufen"
              : "All systems operational"}
          </div>
        </footer>
      </div>

      {/* Modals would go here */}
{modalType && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div
      className="rounded-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
          {modalType === "addApiKey" && "Add API Key"}
          {modalType === "deleteApiKey" && "Delete API Key"}
        </h2>

        <button
          onClick={handleCloseModal}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400 cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* ADD API KEY */}
        {modalType === "addApiKey" && (
          <div className="space-y-4">

            <div>
              <label className="block text-xs text-gray-500 mb-1.5">
                Key Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Stripe Production Key"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5">
                API Key
              </label>
              <input
                type="password"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                placeholder="Enter API key"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-500"
              />
            </div>

            <div className="p-3 rounded-lg border border-yellow-200 bg-yellow-50 text-xs text-yellow-700">
              Make sure to store API keys securely. Keys will be encrypted.
            </div>
          </div>
        )}

        {/* DELETE API KEY */}
        {modalType === "deleteApiKey" && currentApiKey && (
          <div className="space-y-4">

            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50">
              <AlertTriangle size={22} className="text-red-500" />
              <div>
                <p className="text-sm text-gray-900">
                  Are you sure you want to delete this API key?
                </p>
                <p className="text-xs text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-xl">
              <p className="text-sm text-gray-900">{currentApiKey.name}</p>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>• Integrations using this key may stop working</p>
              <p>• You will need to regenerate and reconfigure services</p>
            </div>

          </div>
        )}

      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">

        <button
          onClick={handleCloseModal}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
        >
          Cancel
        </button>

        {modalType === "deleteApiKey" ? (
          <button
            onClick={handleDeleteApiKey}
            className="px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2 cursor-pointer"
            style={{ backgroundColor: danger }}
          >
            <Trash2 size={14} />
            Delete
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2 cursor-pointer"
            style={{ backgroundColor: primary }}
          >
            <Check size={14} />
            Save
          </button>
        )}

      </div>
    </div>
  </div>
)}
    </div>
  );
}