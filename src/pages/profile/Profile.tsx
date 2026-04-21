import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Key,
  Smartphone,
  Monitor,
  Trash2,
  Edit2,
  X,
  Check,
  Globe,
  Clock,
  LogOut,
  Camera,
  AlertTriangle,
} from "lucide-react";

import { AdminSidebar } from "@/pages/adminDashboard/components/AdminSidebar";
import { TopBar } from "@/pages/adminDashboard/components/TopBar";
import { useLangStore } from "@/shared/stores/langStore";
import { primary, danger, success, bg } from "@/shared/styles/colors";

export function ProfilePage() {
  
  const { lang } = useLangStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);

  // Profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);


  // Form state
  const [profileData, setProfileData] = useState({
    fullName: "Alex Thompson",
    email: "alex.thompson@m10platform.com",
    phone: "+1 (555) 123-4567",
    bio: "Senior QA Engineer passionate about automation and quality.",
    location: "San Francisco, CA",
    timezone: "America/Los_Angeles"
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Mock sessions data
  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: "Chrome on MacBook Pro",
      location: "San Francisco, CA",
      ip: "192.168.1.105",
      lastActive: "Active now",
      current: true,
    },
    {
      id: 2,
      device: "Safari on iPhone 14",
      location: "San Francisco, CA",
      ip: "192.168.1.142",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      id: 3,
      device: "Firefox on Windows PC",
      location: "New York, NY",
      ip: "74.125.224.72",
      lastActive: "1 day ago",
      current: false,
    },
  ]);

  const handleProfileSave = () => {
    // Save logic here
    setIsEditingProfile(false);
  };

  const handlePasswordChange = () => {
    // Password change logic here
    setPasswordData({ current: "", new: "", confirm: "" });
    setIsEditingPassword(false);
  };

  const handleRevokeSession = (id: number) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  const handleRevokeAllSessions = () => {
    setSessions(sessions.filter((s) => s.current));
  };

  const t = {
    pageTitle: lang === "tr" ? "Profil Ayarları" : lang === "de" ? "Profilienstellungen" : "Profile Settings",
    pageSubtitle: lang === "tr" ? "Hesap bilgilerinizi ve tercihlerinizi yönetin" : lang === "de" ? "Verwalten Sie Ihre Kontoinformationen und Einstellungen" : "Manage your account information and preferences",
    profile: {
      title: lang === "tr" ? "Profil Bilgileri" : lang === "de" ? "Profilinformationen" : "Profile Information",
      edit: lang === "tr" ? "Düzenle" : lang === "de" ? "Bearbeiten" : "Edit",
      save: lang === "tr" ? "Kaydet" : lang === "de" ? "Speichern" : "Save",
      cancel: lang === "tr" ? "İptal" : lang === "de" ? "Abbrechen" : "Cancel",
      fullName: lang === "tr" ? "Tam Ad" : lang === "de" ? "Vollständiger Name" : "Full Name",
      email: lang === "tr" ? "E-posta" : lang === "de" ? "E-Mail" : "Email",
      phone: lang === "tr" ? "Telefon" : lang === "de" ? "Telefon" : "Phone",
      bio: lang === "tr" ? "Biyografi" : lang === "de" ? "Biografie" : "Bio",
      location: lang === "tr" ? "Konum" : lang === "de" ? "Standort" : "Location",
      joinedOn: lang === "tr" ? "Katılma Tarihi" : lang === "de" ? "Beigetreten am" : "Joined on",
      role: lang === "tr" ? "Rol" : lang === "de" ? "Rolle" : "Role",
    },
    security: {
      title: lang === "tr" ? "Güvenlik" : lang === "de" ? "Sicherheit" : "Security",
      password: lang === "tr" ? "Şifre Değiştir" : lang === "de" ? "Passwort ändern" : "Change Password",
      currentPassword: lang === "tr" ? "Mevcut Şifre" : lang === "de" ? "Aktuelles Passwort" : "Current Password",
      newPassword: lang === "tr" ? "Yeni Şifre" : lang === "de" ? "Neues Passwort" : "New Password",
      confirmPassword: lang === "tr" ? "Şifreyi Onayla" : lang === "de" ? "Passwort bestätigen" : "Confirm Password",
      twoFactor: lang === "tr" ? "İki Faktörlü Doğrulama" : lang === "de" ? "Zwei-Faktor-Authentifizierung" : "Two-Factor Authentication",
      twoFactorDesc: lang === "tr" ? "Hesabınıza ekstra güvenlik katmanı ekleyin" : lang === "de" ? "Fügen Sie Ihrem Konto eine zusätzliche Sicherheitsebene hinzu" : "Add an extra layer of security to your account",
      updatePassword: lang === "tr" ? "Şifreyi Güncelle" : lang === "de" ? "Passwort aktualisieren" : "Update Password",
    },
    sessions: {
      title: lang === "tr" ? "Oturum Yönetimi" : lang === "de" ? "Sitzungsverwaltung" : "Session Management",
      active: lang === "tr" ? "Aktif Oturumlar" : lang === "de" ? "Aktive Sitzungen" : "Active Sessions",
      current: lang === "tr" ? "Mevcut Oturum" : lang === "de" ? "Aktuelle Sitzung" : "Current Session",
      revoke: lang === "tr" ? "İptal Et" : lang === "de" ? "Widerrufen" : "Revoke",
      revokeAll: lang === "tr" ? "Tüm Diğer Oturumları İptal Et" : lang === "de" ? "Alle anderen Sitzungen widerrufen" : "Revoke All Other Sessions",
    },
    preferences: {
      title: lang === "tr" ? "Tercihler" : lang === "de" ? "Einstellungen" : "Preferences",
      language: lang === "tr" ? "Dil" : lang === "de" ? "Sprache" : "Language",
      timezone: lang === "tr" ? "Saat Dilimi" : lang === "de" ? "Zeitzone" : "Timezone"
    },
    danger: {
      title: lang === "tr" ? "Tehlikeli Bölge" : lang === "de" ? "Gefahrenzone" : "Danger Zone",
      delete: lang === "tr" ? "Hesabı Sil" : lang === "de" ? "Konto löschen" : "Delete Account",
      deleteDesc: lang === "tr" ? "Hesabınızı kalıcı olarak silin. Bu işlem geri alınamaz." : lang === "de" ? "Löschen Sie Ihr Konto dauerhaft. Diese Aktion kann nicht rückgängig gemacht werden." : "Permanently delete your account. This action cannot be undone.",
    },
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: bg, fontFamily: "Inter, sans-serif" }}>
      <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          lang={lang}
          notifCount={0}
          onNotifClick={() => setNotifPanelOpen(!notifPanelOpen)}
        />

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

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* LEFT COLUMN (2/3) */}
            <div className="xl:col-span-2 space-y-6">
              {/* Profile Header Card */}
              <div
                className="rounded-2xl border border-gray-100 p-6"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="relative group">
                    <div
                      className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-2xl shrink-0"
                      style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                    >
                      AT
                    </div>
                    <button
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Camera style={{ width: "20px", height: "20px", color: "#ffffff" }} />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h2 className="text-xl text-gray-900 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                      {profileData.fullName}
                    </h2>
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="px-3 py-1 rounded-lg text-xs text-white"
                        style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                      >
                        Senior QA Engineer
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail style={{ width: "14px", height: "14px" }} />
                        <span style={{ fontFamily: "Inter, sans-serif" }}>{profileData.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin style={{ width: "14px", height: "14px" }} />
                        <span style={{ fontFamily: "Inter, sans-serif" }}>{profileData.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone style={{ width: "14px", height: "14px" }} />
                        <span style={{ fontFamily: "Inter, sans-serif" }}>{profileData.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar style={{ width: "14px", height: "14px" }} />
                        <span style={{ fontFamily: "Inter, sans-serif" }}>
                          {t.profile.joinedOn} January 15, 2023
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information Card */}
              <div
                className="rounded-2xl border border-gray-100 overflow-hidden"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                    {t.profile.title}
                  </h2>
                  {!isEditingProfile ? (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50 transition-colors cursor-pointer"
                      style={{ color: primary, fontFamily: "Inter, sans-serif" }}
                    >
                      <Edit2 style={{ width: "12px", height: "12px" }} />
                      {t.profile.edit}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        <X style={{ width: "12px", height: "12px" }} />
                        {t.profile.cancel}
                      </button>
                      <button
                        onClick={handleProfileSave}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white cursor-pointer"
                        style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                      >
                        <Check style={{ width: "12px", height: "12px" }} />
                        {t.profile.save}
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.profile.fullName}
                      </label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.profile.email}
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditingProfile}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.profile.phone}
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditingProfile}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.profile.bio}
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      disabled={!isEditingProfile}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.profile.location}
                    </label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      disabled={!isEditingProfile}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    />
                  </div>
                </div>
              </div>

              {/* Security Card */}
              <div
                className="rounded-2xl border border-gray-100 overflow-hidden"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                    {t.security.title}
                  </h2>
                </div>

                <div className="p-5 space-y-5">
                  {/* Password Change */}
                  <div className="pb-5 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: "#EEF2FF" }}
                        >
                          <Key style={{ width: "18px", height: "18px", color: primary }} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                            {t.security.password}
                          </p>
                          <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                            Last changed 3 months ago
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsEditingPassword(!isEditingPassword)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {isEditingPassword ? t.profile.cancel : t.profile.edit}
                      </button>
                    </div>

                    {isEditingPassword && (
                      <div className="space-y-3 mt-4 pl-13">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                            {t.security.currentPassword}
                          </label>
                          <input
                            type="password"
                            value={passwordData.current}
                            onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                            {t.security.newPassword}
                          </label>
                          <input
                            type="password"
                            value={passwordData.new}
                            onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                            {t.security.confirmPassword}
                          </label>
                          <input
                            type="password"
                            value={passwordData.confirm}
                            onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          />
                        </div>
                        <button
                          onClick={handlePasswordChange}
                          className="w-full px-4 py-2 rounded-lg text-sm text-white cursor-pointer"
                          style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                        >
                          {t.security.updatePassword}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Two-Factor Authentication */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: twoFactorEnabled ? "#EBFBEE" : "#F3F4F6" }}
                        >
                          <Shield
                            style={{
                              width: "18px",
                              height: "18px",
                              color: twoFactorEnabled ? success : "#9CA3AF",
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                            {t.security.twoFactor}
                          </p>
                          <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                            {t.security.twoFactorDesc}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        className="relative w-11 h-6 rounded-full transition-colors"
                        style={{ backgroundColor: twoFactorEnabled ? success : "#E5E7EB" }}
                      >
                        <span
                          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform"
                          style={{ transform: twoFactorEnabled ? "translateX(20px)" : "translateX(0)" }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Management */}
              <div
                className="rounded-2xl border border-gray-100 overflow-hidden"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                    {t.sessions.title}
                  </h2>
                  {sessions.filter((s) => !s.current).length > 0 && (
                    <button
                      onClick={handleRevokeAllSessions}
                      className="px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50 transition-colors cursor-pointer"
                      style={{ color: danger, fontFamily: "Inter, sans-serif" }}
                    >
                      {t.sessions.revokeAll}
                    </button>
                  )}
                </div>

                <div className="divide-y divide-gray-50">
                  {sessions.map((session) => (
                    <div key={session.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{
                              backgroundColor: session.current ? "#EEF2FF" : "#F3F4F6",
                            }}
                          >
                            {session.device.includes("iPhone") ? (
                              <Smartphone
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  color: session.current ? primary : "#9CA3AF",
                                }}
                              />
                            ) : (
                              <Monitor
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  color: session.current ? primary : "#9CA3AF",
                                }}
                              />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                                {session.device}
                              </p>
                              {session.current && (
                                <span
                                  className="px-2 py-0.5 rounded text-xs text-white"
                                  style={{ backgroundColor: success, fontFamily: "Inter, sans-serif" }}
                                >
                                  {t.sessions.current}
                                </span>
                              )}
                            </div>
                            <div className="space-y-0.5 text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                              <p className="flex items-center gap-1.5">
                                <MapPin style={{ width: "11px", height: "11px" }} />
                                {session.location}
                              </p>
                              <p className="flex items-center gap-1.5">
                                <Globe style={{ width: "11px", height: "11px" }} />
                                {session.ip}
                              </p>
                              <p className="flex items-center gap-1.5">
                                <Clock style={{ width: "11px", height: "11px" }} />
                                {session.lastActive}
                              </p>
                            </div>
                          </div>
                        </div>
                        {!session.current && (
                          <button
                            onClick={() => handleRevokeSession(session.id)}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            <LogOut style={{ width: "12px", height: "12px" }} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (1/3) */}
            <div className="space-y-6">

              {/* Danger Zone */}
              <div
                className="rounded-2xl border overflow-hidden"
                style={{ backgroundColor: "#FFF5F5", borderColor: "#FEE2E2" }}
              >
                <div className="px-5 py-4 border-b" style={{ borderColor: "#FEE2E2" }}>
                  <h2 className="text-sm" style={{ color: danger, fontFamily: "Inter, sans-serif" }}>
                    {t.danger.title}
                  </h2>
                </div>

                <div className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle style={{ width: "18px", height: "18px", color: danger }} />
                    <div>
                      <p className="text-sm text-gray-900 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.danger.delete}
                      </p>
                      <p className="text-xs text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.danger.deleteDesc}
                      </p>
                    </div>
                  </div>
                  <button
                    className="w-full px-4 py-2 rounded-lg text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
                    style={{ backgroundColor: danger, fontFamily: "Inter, sans-serif" }}
                  >
                    <Trash2 style={{ width: "14px", height: "14px" }} />
                    {t.danger.delete}
                  </button>
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
            © 2026 M10 Platform. All rights reserved.
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
    </div>
  );
}