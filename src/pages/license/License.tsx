import { useState } from "react";
import {
  CreditCard,
  Download,
  Eye,
  RefreshCw,
  XCircle,
  Check,
  X,
  Calendar,
  Users,
  DollarSign,
  AlertTriangle,
  Star,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { AdminSidebar } from "@/shared/ui/admin/components/AdminSidebar";
import { TopBar } from "@/shared/ui/admin/components/TopBar";
import { StatCard } from "@/shared/ui/admin/components/StatCard";
import { LicenseTypeBadge } from "@/pages/license/components/LicenseTypeBadge";
import { LicenseStatusBadge } from "@/pages/license/components/LicenseStatusBadge";

import { useLangStore } from "@/shared/stores/langStore";
import { primary, danger, warning, success, bg } from "@/shared/styles/colors";
import {
  activeLicenses as initialLicenses,
  licenseStats,
  licenseHistory,
  availableLicenses,
  usageData,
} from "@/entities/licenseManagement";

type License = {
  id: number;
  name: string;
  type: string;
  status: string;
  seats: number;
  usedSeats: number;
  price: number;
  billingCycle: string;
  startDate: string;
  expiryDate: string;
  autoRenew: boolean;
  features: string[];
};

type ModalType = "add" | "view" | "renew" | "cancel" | null;

export function LicenseManagement() {
  
  const { lang } = useLangStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);

  const [licenses, setLicenses] = useState<License[]>(initialLicenses);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentLicense, setCurrentLicense] = useState<License | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"active" | "history" | "usage">("active");

  const [formData, setFormData] = useState({
    planId: "",
    seats: 25,
    billingCycle: "monthly" as "monthly" | "annual",
  });

  const t = {
    pageTitle: lang === "tr" ? "Lisans Yönetimi" : lang === "de" ? "Lizenzverwaltung" : "License Management",
    pageSubtitle:
      lang === "tr"
        ? "Aboneliklerinizi yönetin, lisansları yenileyin ve kullanımı takip edin"
        : lang === "de"
        ? "Verwalten Sie Abonnements, erneuern Sie Lizenzen und verfolgen Sie die Nutzung"
        : "Manage subscriptions, renew licenses, and track usage",
    stats: {
      active: lang === "tr" ? "Aktif Lisanslar" : lang === "de" ? "Aktive Lizenzen" : "Active Licenses",
      seats: lang === "tr" ? "Toplam Koltuk" : lang === "de" ? "Gesamtsitze" : "Total Seats",
      expiring: lang === "tr" ? "Yakında Sona Eriyor" : lang === "de" ? "Läuft bald ab" : "Expiring Soon",
      spend: lang === "tr" ? "Aylık Harcama" : lang === "de" ? "Monatliche Ausgaben" : "Monthly Spend",
      used: lang === "tr" ? "kullanımda" : lang === "de" ? "verwendet" : "used",
      within30: lang === "tr" ? "30 gün içinde" : lang === "de" ? "in 30 Tagen" : "within 30 days",
    },
    actions: {
      addLicense: lang === "tr" ? "Lisans Ekle" : lang === "de" ? "Lizenz hinzufügen" : "Add License",
      exportInvoices: lang === "tr" ? "Faturaları Dışa Aktar" : lang === "de" ? "Rechnungen exportieren" : "Export Invoices",
      viewDetails: lang === "tr" ? "Detayları Gör" : lang === "de" ? "Details anzeigen" : "View Details",
      renew: lang === "tr" ? "Yenile" : lang === "de" ? "Erneuern" : "Renew",
      cancel: lang === "tr" ? "İptal Et" : lang === "de" ? "Abbrechen" : "Cancel",
      download: lang === "tr" ? "İndir" : lang === "de" ? "Herunterladen" : "Download",
    },
    tabs: {
      active: lang === "tr" ? "Aktif Lisanslar" : lang === "de" ? "Aktive Lizenzen" : "Active Licenses",
      history: lang === "tr" ? "Geçmiş" : lang === "de" ? "Verlauf" : "History",
      usage: lang === "tr" ? "Kullanım" : lang === "de" ? "Nutzung" : "Usage",
    },
    table: {
      license: lang === "tr" ? "Lisans" : lang === "de" ? "Lizenz" : "License",
      type: lang === "tr" ? "Tür" : lang === "de" ? "Typ" : "Type",
      seats: lang === "tr" ? "Koltuklar" : lang === "de" ? "Sitze" : "Seats",
      status: lang === "tr" ? "Durum" : lang === "de" ? "Status" : "Status",
      billing: lang === "tr" ? "Faturalama" : lang === "de" ? "Abrechnung" : "Billing",
      expiry: lang === "tr" ? "Son Kullanma" : lang === "de" ? "Ablauf" : "Expiry",
      autoRenew: lang === "tr" ? "Otomatik Yenileme" : lang === "de" ? "Auto-Verlängerung" : "Auto-Renew",
      actions: lang === "tr" ? "İşlemler" : lang === "de" ? "Aktionen" : "Actions",
    },
    history: {
      action: lang === "tr" ? "İşlem" : lang === "de" ? "Aktion" : "Action",
      license: lang === "tr" ? "Lisans" : lang === "de" ? "Lizenz" : "License",
      date: lang === "tr" ? "Tarih" : lang === "de" ? "Datum" : "Date",
      amount: lang === "tr" ? "Tutar" : lang === "de" ? "Betrag" : "Amount",
      invoice: lang === "tr" ? "Fatura" : lang === "de" ? "Rechnung" : "Invoice",
      status: lang === "tr" ? "Durum" : lang === "de" ? "Status" : "Status",
      renewed: lang === "tr" ? "Yenilendi" : lang === "de" ? "Erneuert" : "Renewed",
      purchased: lang === "tr" ? "Satın Alındı" : lang === "de" ? "Gekauft" : "Purchased",
      upgraded: lang === "tr" ? "Yükseltildi" : lang === "de" ? "Aktualisiert" : "Upgraded",
      refunded: lang === "tr" ? "İade Edildi" : lang === "de" ? "Zurückerstattet" : "Refunded",
      cancelled: lang === "tr" ? "İptal Edildi" : lang === "de" ? "Abgebrochen" : "Cancelled",
      paid: lang === "tr" ? "Ödendi" : lang === "de" ? "Bezahlt" : "Paid",
    },
    modal: {
      addLicense: lang === "tr" ? "Yeni Lisans Ekle" : lang === "de" ? "Neue Lizenz hinzufügen" : "Add New License",
      viewDetails: lang === "tr" ? "Lisans Detayları" : lang === "de" ? "Lizenzdetails" : "License Details",
      renewLicense: lang === "tr" ? "Lisansı Yenile" : lang === "de" ? "Lizenz erneuern" : "Renew License",
      cancelLicense: lang === "tr" ? "Lisansı İptal Et" : lang === "de" ? "Lizenz abbrechen" : "Cancel License",
      selectPlan: lang === "tr" ? "Plan Seç" : lang === "de" ? "Plan auswählen" : "Select Plan",
      seats: lang === "tr" ? "Koltuk Sayısı" : lang === "de" ? "Anzahl der Sitze" : "Number of Seats",
      billingCycle: lang === "tr" ? "Faturalama Dönemi" : lang === "de" ? "Abrechnungszeitraum" : "Billing Cycle",
      monthly: lang === "tr" ? "Aylık" : lang === "de" ? "Monatlich" : "Monthly",
      annual: lang === "tr" ? "Yıllık" : lang === "de" ? "Jährlich" : "Annual",
      save: lang === "tr" ? "Kaydet" : lang === "de" ? "Speichern" : "Save",
      purchase: lang === "tr" ? "Satın Al" : lang === "de" ? "Kaufen" : "Purchase",
      close: lang === "tr" ? "Kapat" : lang === "de" ? "Schließen" : "Close",
      features: lang === "tr" ? "Özellikler" : lang === "de" ? "Funktionen" : "Features",
      cancelWarning:
        lang === "tr"
          ? "Bu lisansı iptal etmek istediğinizden emin misiniz?"
          : lang === "de"
          ? "Sind Sie sicher, dass Sie diese Lizenz abbrechen möchten?"
          : "Are you sure you want to cancel this license?",
      cancelNote:
        lang === "tr"
          ? "Mevcut dönem sonuna kadar erişiminiz devam edecek."
          : lang === "de"
          ? "Ihr Zugang bleibt bis zum Ende der aktuellen Periode aktiv."
          : "You'll have access until the end of the current billing period.",
      savePerYear: lang === "tr" ? "yılda tasarruf" : lang === "de" ? "pro Jahr sparen" : "save per year",
      total: lang === "tr" ? "Toplam" : lang === "de" ? "Gesamt" : "Total",
    },
    usage: {
      title: lang === "tr" ? "Kullanım İstatistikleri" : lang === "de" ? "Nutzungsstatistiken" : "Usage Statistics",
      testRuns: lang === "tr" ? "Test Çalıştırmaları" : lang === "de" ? "Testläufe" : "Test Runs",
      seatUsage: lang === "tr" ? "Koltuk Kullanımı" : lang === "de" ? "Sitznutzung" : "Seat Usage",
    },
  };

  const handleOpenModal = (type: ModalType, license?: License, plan?: any) => {
    setModalType(type);
    setCurrentLicense(license || null);
    setSelectedPlan(plan || null);

    if (type === "add" && plan) {
      setFormData({
        planId: plan.id,
        seats: plan.seats.default,
        billingCycle: "monthly",
      });
    } else if (type === "renew" && license) {
      setFormData({
        planId: "",
        seats: license.seats,
        billingCycle: license.billingCycle as "monthly" | "annual",
      });
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setCurrentLicense(null);
    setSelectedPlan(null);
  };

  const handleToggleAutoRenew = (licenseId: number) => {
    setLicenses(licenses.map((lic) => (lic.id === licenseId ? { ...lic, autoRenew: !lic.autoRenew } : lic)));
  };

  const handleCancelLicense = () => {
    if (currentLicense) {
      setLicenses(
        licenses.map((lic) =>
          lic.id === currentLicense.id ? { ...lic, status: "expired", autoRenew: false } : lic
        )
      );
      handleCloseModal();
    }
  };

  const handlePurchaseLicense = () => {
    if (selectedPlan) {
      const newLicense: License = {
        id: licenses.length + 1,
        name: selectedPlan.name,
        type: selectedPlan.type,
        status: "active",
        seats: formData.seats,
        usedSeats: 0,
        price: formData.billingCycle === "monthly" ? selectedPlan.monthlyPrice : selectedPlan.annualPrice / 12,
        billingCycle: formData.billingCycle,
        startDate: new Date().toISOString().split("T")[0],
        expiryDate: new Date(
          formData.billingCycle === "annual"
            ? new Date().setFullYear(new Date().getFullYear() + 1)
            : new Date().setMonth(new Date().getMonth() + 1)
        )
          .toISOString()
          .split("T")[0],
        autoRenew: true,
        features: selectedPlan.features,
      };
      setLicenses([...licenses, newLicense]);
      handleCloseModal();
    }
  };

  const overviewCards = [
    {
      label: t.stats.active,
      value: licenseStats.activeLicenses.toString(),
      delta: undefined,
      deltaLabel: `${licenses.filter((l) => l.status === "active").length} active now`,
      icon: CreditCard,
      color: primary,
      bg: "#EEF2FF",
    },
    {
      label: t.stats.seats,
      value: `${licenseStats.usedSeats}/${licenseStats.totalSeats}`,
      delta: undefined,
      deltaLabel: `${((licenseStats.usedSeats / licenseStats.totalSeats) * 100).toFixed(0)}% ${t.stats.used}`,
      icon: Users,
      color: success,
      bg: "#EBFBEE",
    },
    {
      label: t.stats.expiring,
      value: licenseStats.expiringWithin30Days.toString(),
      delta: undefined,
      deltaLabel: t.stats.within30,
      icon: AlertTriangle,
      color: warning,
      bg: "#FFF9DB",
    },
    {
      label: t.stats.spend,
      value: `$${licenseStats.monthlySpend.toLocaleString()}`,
      delta: undefined,
      deltaLabel: `$${licenseStats.annualSpend.toLocaleString()}/year`,
      icon: DollarSign,
      color: "#7048E8",
      bg: "#F3F0FF",
    },
  ];

  const calculateSavings = (monthlyPrice: number, annualPrice: number) => {
    return (monthlyPrice * 12 - annualPrice).toFixed(0);
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      renewed: t.history.renewed,
      purchased: t.history.purchased,
      upgraded: t.history.upgraded,
      refunded: t.history.refunded,
      cancelled: t.history.cancelled,
    };
    return labels[action] || action;
  };

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
              {(["active", "history", "usage"] as const).map((tab) => (
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

          {/* Active Licenses Tab */}
          {activeTab === "active" && (
            <div className="space-y-6">
              {/* Available Plans */}
              <div className="rounded-2xl border border-gray-100 p-5" style={{ backgroundColor: "#ffffff" }}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                    {lang === "tr" ? "Mevcut Planlar" : lang === "de" ? "Verfügbare Pläne" : "Available Plans"}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableLicenses.map((plan) => (
                    <div
                      key={plan.id}
                      className="relative rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all"
                      style={{ backgroundColor: "#ffffff" }}
                    >
                      {plan.popular && (
                        <div
                          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs text-white flex items-center gap-1"
                          style={{ backgroundColor: warning, fontFamily: "Inter, sans-serif" }}
                        >
                          <Star style={{ width: "12px", height: "12px" }} />
                          Popular
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <LicenseTypeBadge type={plan.type} size="md" />
                          <h3 className="text-lg text-gray-900 mt-2 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                            {plan.name}
                          </h3>
                          <p className="text-xs text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                            {plan.description}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                            ${plan.monthlyPrice}
                          </span>
                          <span className="text-sm text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                            /month
                          </span>
                        </div>
                        <p className="text-xs mt-1" style={{ color: success, fontFamily: "Inter, sans-serif" }}>
                          ${calculateSavings(plan.monthlyPrice, plan.annualPrice)} {t.modal.savePerYear}
                        </p>
                      </div>

                      <ul className="space-y-2 mb-5">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                            <Check
                              style={{
                                width: "14px",
                                height: "14px",
                                color: success,
                                flexShrink: 0,
                                marginTop: "2px",
                              }}
                            />
                            <span style={{ fontFamily: "Inter, sans-serif" }}>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleOpenModal("add", undefined, plan)}
                        className="w-full py-2 rounded-lg text-sm text-white hover:opacity-90 transition-opacity cursor-pointer"
                        style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                      >
                        {t.actions.addLicense}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Licenses Table */}
              <div className="rounded-2xl border border-gray-100 overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                    {lang === "tr"
                      ? "Mevcut Lisanslarınız"
                      : lang === "de"
                      ? "Ihre aktuellen Lizenzen"
                      : "Your Current Licenses"}
                  </h2>
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <Download style={{ width: "14px", height: "14px" }} />
                    {t.actions.exportInvoices}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: bg }}>
                        <th
                          className="px-4 py-3 text-left text-xs text-gray-400"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {t.table.license}
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs text-gray-400"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {t.table.type}
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs text-gray-400"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {t.table.seats}
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs text-gray-400"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {t.table.status}
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs text-gray-400"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {t.table.billing}
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs text-gray-400"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {t.table.expiry}
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs text-gray-400"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {t.table.autoRenew}
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs text-gray-400"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {t.table.actions}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {licenses
                        .filter((l) => l.status !== "expired")
                        .map((license) => {
                          const utilizationPct = (license.usedSeats / license.seats) * 100;
                          const daysUntilExpiry = Math.floor(
                            (new Date(license.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                          );

                          return (
                            <tr key={license.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3">
                                <div>
                                  <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                                    {license.name}
                                  </p>
                                  <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                                    ${license.price}/{license.billingCycle === "monthly" ? "mo" : "yr"}
                                  </p>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <LicenseTypeBadge type={license.type} />
                              </td>
                              <td className="px-4 py-3">
                                <div>
                                  <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                                    {license.usedSeats}/{license.seats}
                                  </p>
                                  <div className="w-16 h-1.5 rounded-full mt-1" style={{ backgroundColor: "#F3F4F6" }}>
                                    <div
                                      className="h-1.5 rounded-full transition-all"
                                      style={{
                                        width: `${utilizationPct}%`,
                                        backgroundColor:
                                          utilizationPct >= 90 ? danger : utilizationPct >= 75 ? warning : success,
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <LicenseStatusBadge status={license.status} lang={lang} />
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className="text-sm text-gray-700 whitespace-nowrap capitalize"
                                  style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                  {license.billingCycle}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div>
                                  <p className="text-sm text-gray-900 whitespace-nowrap" style={{ fontFamily: "Inter, sans-serif" }}>
                                    {license.expiryDate}
                                  </p>
                                  <p
                                    className="text-xs whitespace-nowrap"
                                    style={{
                                      color: daysUntilExpiry <= 30 ? warning : "#9CA3AF",
                                      fontFamily: "Inter, sans-serif",
                                    }}
                                  >
                                    {daysUntilExpiry} days left
                                  </p>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => handleToggleAutoRenew(license.id)}
                                  className="relative w-11 h-6 rounded-full transition-colors cursor-pointer"
                                  style={{ backgroundColor: license.autoRenew ? success : "#E5E7EB" }}
                                >
                                  <span
                                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform"
                                    style={{
                                      transform: license.autoRenew ? "translateX(20px)" : "translateX(0)",
                                    }}
                                  />
                                </button>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleOpenModal("view", license)}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 cursor-pointer"
                                    title={t.actions.viewDetails}
                                  >
                                    <Eye style={{ width: "14px", height: "14px" }} />
                                  </button>
                                  <button
                                    onClick={() => handleOpenModal("renew", license)}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 cursor-pointer"
                                    title={t.actions.renew}
                                  >
                                    <RefreshCw style={{ width: "14px", height: "14px" }} />
                                  </button>
                                  <button
                                    onClick={() => handleOpenModal("cancel", license)}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600 cursor-pointer"
                                    title={t.actions.cancel}
                                  >
                                    <XCircle style={{ width: "14px", height: "14px" }} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="rounded-2xl border border-gray-100 overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                  {lang === "tr" ? "İşlem Geçmişi" : lang === "de" ? "Transaktionsverlauf" : "Transaction History"}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: bg }}>
                      <th
                        className="px-4 py-3 text-left text-xs text-gray-400"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {t.history.action}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs text-gray-400"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {t.history.license}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs text-gray-400"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {t.history.date}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs text-gray-400"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {t.history.amount}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs text-gray-400"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {t.history.invoice}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs text-gray-400"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {t.history.status}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs text-gray-400"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {t.table.actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {licenseHistory.map((item) => (
                      <tr key={item.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-xs capitalize"
                            style={{
                              backgroundColor:
                                item.action === "refunded" || item.action === "cancelled"
                                  ? "#FFF5F5"
                                  : item.action === "upgraded"
                                  ? "#FFF9DB"
                                  : "#EBFBEE",
                              color:
                                item.action === "refunded" || item.action === "cancelled"
                                  ? danger
                                  : item.action === "upgraded"
                                  ? warning
                                  : success,
                              fontFamily: "Inter, sans-serif",
                            }}
                          >
                            {getActionLabel(item.action)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                            {item.licenseName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700 whitespace-nowrap" style={{ fontFamily: "Inter, sans-serif" }}>
                            {item.date}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-sm whitespace-nowrap"
                            style={{
                              color: item.amount < 0 ? danger : "#1F2937",
                              fontFamily: "Inter, sans-serif",
                            }}
                          >
                            {item.amount < 0 ? "-" : ""}${Math.abs(item.amount).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700 whitespace-nowrap" style={{ fontFamily: "Inter, sans-serif" }}>
                            {item.invoiceId}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-xs capitalize"
                            style={{
                              backgroundColor:
                                item.status === "paid"
                                  ? "#EBFBEE"
                                  : item.status === "refunded"
                                  ? "#FFF5F5"
                                  : "#F3F4F6",
                              color: item.status === "paid" ? success : item.status === "refunded" ? danger : "#868E96",
                              fontFamily: "Inter, sans-serif",
                            }}
                          >
                            {item.status === "paid"
                              ? t.history.paid
                              : item.status === "refunded"
                              ? t.history.refunded
                              : t.history.cancelled}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {item.invoiceId !== "-" && (
                            <button
                              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 cursor-pointer"
                              title={t.actions.download}
                            >
                              <Download style={{ width: "14px", height: "14px" }} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Usage Tab */}
          {activeTab === "usage" && (
            <div className="space-y-6">
              {/* Test Runs Chart */}
              <div className="rounded-2xl border border-gray-100 p-5" style={{ backgroundColor: "#ffffff" }}>
                <h2 className="text-sm text-gray-700 mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
                  {t.usage.testRuns}
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={usageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradTests" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={primary} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis
                      dataKey="month"
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
                      itemStyle={{ fontFamily: "Inter, sans-serif" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="tests"
                      stroke={primary}
                      strokeWidth={2}
                      fill="url(#gradTests)"
                      dot={false}
                      activeDot={{ r: 4, fill: primary }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Seat Usage Chart */}
              <div className="rounded-2xl border border-gray-100 p-5" style={{ backgroundColor: "#ffffff" }}>
                <h2 className="text-sm text-gray-700 mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
                  {t.usage.seatUsage}
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={usageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis
                      dataKey="month"
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
                      itemStyle={{ fontFamily: "Inter, sans-serif" }}
                    />
                    <Bar dataKey="seats" fill={success} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
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

      {/* Modals */}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            style={{ backgroundColor: "#ffffff" }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                {modalType === "add" && t.modal.addLicense}
                {modalType === "view" && t.modal.viewDetails}
                {modalType === "renew" && t.modal.renewLicense}
                {modalType === "cancel" && t.modal.cancelLicense}
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
              {/* Add License Modal */}
              {modalType === "add" && selectedPlan && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <LicenseTypeBadge type={selectedPlan.type} size="md" />
                        <h3 className="text-lg text-gray-900 mt-2" style={{ fontFamily: "Inter, sans-serif" }}>
                          {selectedPlan.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                          {selectedPlan.description}
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {selectedPlan.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check
                            style={{ width: "16px", height: "16px", color: success, flexShrink: 0, marginTop: "2px" }}
                          />
                          <span style={{ fontFamily: "Inter, sans-serif" }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.modal.billingCycle}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setFormData({ ...formData, billingCycle: "monthly" })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.billingCycle === "monthly" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        } cursor-pointer`}
                      >
                        <p className="text-sm text-gray-900 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                          {t.modal.monthly}
                        </p>
                        <p className="text-2xl text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                          ${selectedPlan.monthlyPrice}
                        </p>
                        <p className="text-xs text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                          per month
                        </p>
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, billingCycle: "annual" })}
                        className={`p-4 rounded-xl border-2 transition-all relative ${
                          formData.billingCycle === "annual" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        } cursor-pointer`}
                      >
                        <div
                          className="absolute -top-2 right-2 px-2 py-0.5 rounded-full text-xs text-white"
                          style={{ backgroundColor: success, fontFamily: "Inter, sans-serif" }}
                        >
                          Save ${calculateSavings(selectedPlan.monthlyPrice, selectedPlan.annualPrice)}
                        </div>
                        <p className="text-sm text-gray-900 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                          {t.modal.annual}
                        </p>
                        <p className="text-2xl text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                          ${Math.floor(selectedPlan.annualPrice / 12)}
                        </p>
                        <p className="text-xs text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                          per month
                        </p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.modal.seats}
                    </label>
                    <input
                      type="number"
                      value={formData.seats}
                      onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) || 1 })}
                      min={selectedPlan.seats.min}
                      max={selectedPlan.seats.max}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    />
                    <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                      {selectedPlan.seats.min}-{selectedPlan.seats.max} seats available
                    </p>
                  </div>

                  <div className="p-4 rounded-xl" style={{ backgroundColor: bg }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600" style={{ fontFamily: "Inter, sans-serif" }}>
                        {formData.seats} × ${formData.billingCycle === "monthly" ? selectedPlan.monthlyPrice : Math.floor(selectedPlan.annualPrice / 12)}
                      </span>
                      <span className="text-lg text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                        ${formData.seats * (formData.billingCycle === "monthly" ? selectedPlan.monthlyPrice : Math.floor(selectedPlan.annualPrice / 12))}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                      Billed {formData.billingCycle === "monthly" ? "monthly" : "annually"}
                    </p>
                  </div>
                </div>
              )}

              {/* View License Modal */}
              {modalType === "view" && currentLicense && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: "#EEF2FF" }}
                    >
                      <CreditCard style={{ width: "32px", height: "32px", color: primary }} />
                    </div>
                    <div>
                      <h3 className="text-lg text-gray-900 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                        {currentLicense.name}
                      </h3>
                      <LicenseTypeBadge type={currentLicense.type} size="md" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.table.status}
                      </p>
                      <LicenseStatusBadge status={currentLicense.status} lang={lang} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.table.billing}
                      </p>
                      <p className="text-sm text-gray-900 capitalize" style={{ fontFamily: "Inter, sans-serif" }}>
                        ${currentLicense.price}/{currentLicense.billingCycle === "monthly" ? "mo" : "yr"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.table.seats}
                      </p>
                      <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                        {currentLicense.usedSeats}/{currentLicense.seats}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.table.autoRenew}
                      </p>
                      <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                        {currentLicense.autoRenew
                          ? lang === "tr"
                            ? "Açık"
                            : lang === "de"
                            ? "An"
                            : "Enabled"
                          : lang === "tr"
                          ? "Kapalı"
                          : lang === "de"
                          ? "Aus"
                          : "Disabled"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                        Start Date
                      </p>
                      <p className="text-sm text-gray-900 flex items-center gap-2" style={{ fontFamily: "Inter, sans-serif" }}>
                        <Calendar style={{ width: "14px", height: "14px" }} />
                        {currentLicense.startDate}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.table.expiry}
                      </p>
                      <p className="text-sm text-gray-900 flex items-center gap-2" style={{ fontFamily: "Inter, sans-serif" }}>
                        <Calendar style={{ width: "14px", height: "14px" }} />
                        {currentLicense.expiryDate}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.modal.features}
                    </p>
                    <ul className="space-y-2">
                      {currentLicense.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check
                            style={{ width: "16px", height: "16px", color: success, flexShrink: 0, marginTop: "2px" }}
                          />
                          <span style={{ fontFamily: "Inter, sans-serif" }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Cancel License Modal */}
              {modalType === "cancel" && currentLicense && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: "#FFF5F5" }}>
                    <AlertTriangle style={{ width: "24px", height: "24px", color: danger }} />
                    <div>
                      <p className="text-sm text-gray-900 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.modal.cancelWarning}
                      </p>
                      <p className="text-xs text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.modal.cancelNote}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: "#EEF2FF" }}
                      >
                        <CreditCard style={{ width: "24px", height: "24px", color: primary }} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                          {currentLicense.name}
                        </p>
                        <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                          ${currentLicense.price}/{currentLicense.billingCycle === "monthly" ? "mo" : "yr"}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1" style={{ fontFamily: "Inter, sans-serif" }}>
                      <p>• Access until {currentLicense.expiryDate}</p>
                      <p>• {currentLicense.usedSeats} active users will lose access</p>
                      <p>• No refund for remaining period</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Renew License Modal */}
              {modalType === "renew" && currentLicense && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: "#EBFBEE" }}>
                    <p className="text-sm text-gray-900 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                      Renew {currentLicense.name}
                    </p>
                    <p className="text-xs text-gray-600" style={{ fontFamily: "Inter, sans-serif" }}>
                      Your license will be extended for another{" "}
                      {formData.billingCycle === "monthly" ? "month" : "year"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.modal.billingCycle}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setFormData({ ...formData, billingCycle: "monthly" })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.billingCycle === "monthly" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        } cursor-pointer`}
                      >
                        <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                          {t.modal.monthly}
                        </p>
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, billingCycle: "annual" })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.billingCycle === "annual" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        } cursor-pointer`}
                      >
                        <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                          {t.modal.annual}
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl" style={{ backgroundColor: bg }}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.modal.total}
                      </span>
                      <span className="text-lg text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                        ${currentLicense.price * (formData.billingCycle === "annual" ? 12 : 1)}
                      </span>
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
                {modalType === "view" ? t.modal.close : t.actions.cancel}
              </button>

              {modalType === "cancel" ? (
                <button
                  onClick={handleCancelLicense}
                  className="px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: danger, fontFamily: "Inter, sans-serif" }}
                >
                  <XCircle style={{ width: "14px", height: "14px" }} />
                  {t.actions.cancel}
                </button>
              ) : modalType === "add" ? (
                <button
                  onClick={handlePurchaseLicense}
                  className="px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                >
                  <Check style={{ width: "14px", height: "14px" }} />
                  {t.modal.purchase}
                </button>
              ) : modalType === "renew" ? (
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                >
                  <RefreshCw style={{ width: "14px", height: "14px" }} />
                  {t.actions.renew}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}