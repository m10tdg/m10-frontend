import { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Power,
  PowerOff,
  Mail,
  Calendar,
  Activity,
  Shield,
  CheckCircle2,
  XCircle,
  Download,
  X,
  Check,
  AlertTriangle,
  Eye,
} from "lucide-react";

import { AdminSidebar } from "@/shared/ui/admin/components/AdminSidebar";
import { TopBar } from "@/shared/ui/admin/components/TopBar";
import { StatCard } from "@/pages/adminDashboard/components/StatCard";
import { RoleBadge } from "@/pages/adminUserManagement/components/RoleBadge";

import { useLangStore } from "@/shared/stores/langStore";
import { primary, danger, warning, success, bg } from "@/shared/styles/colors";
import {
  users as initialUsers,
  userManagementStats,
  departments,
  roleTypes,
  permissions,
} from "@/entities/userManagement";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  roleType: string;
  department: string;
  status: string;
  avatar: string;
  color: string;
  joinDate: string;
  lastActive: string;
  testsRun: number;
  permissions: string[];
};

type ModalType = "add" | "edit" | "delete" | "view" | null;

export function UserManagement() {
  const { lang } = useLangStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);

  // State
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Form state for add/edit modal
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    roleType: "qa",
    department: "Quality Assurance",
    permissions: [] as string[],
  });

  const t = {
    pageTitle: lang === "tr" ? "Kullanıcı Yönetimi" : lang === "de" ? "Benutzerverwaltung" : "User Management",
    pageSubtitle:
      lang === "tr"
        ? "Kullanıcıları yönetin, roller atayın ve izinleri kontrol edin"
        : lang === "de"
        ? "Benutzer verwalten, Rollen zuweisen und Berechtigungen steuern"
        : "Manage users, assign roles, and control permissions",
    stats: {
      total: lang === "tr" ? "Toplam Kullanıcı" : lang === "de" ? "Gesamtbenutzer" : "Total Users",
      active: lang === "tr" ? "Aktif" : lang === "de" ? "Aktiv" : "Active",
      inactive: lang === "tr" ? "İnaktif" : lang === "de" ? "Inaktiv" : "Inactive",
      roles: lang === "tr" ? "Roller" : lang === "de" ? "Rollen" : "Roles",
    },
    actions: {
      addUser: lang === "tr" ? "Kullanıcı Ekle" : lang === "de" ? "Benutzer hinzufügen" : "Add User",
      export: lang === "tr" ? "Dışa Aktar" : lang === "de" ? "Exportieren" : "Export",
      import: lang === "tr" ? "İçe Aktar" : lang === "de" ? "Importieren" : "Import",
      bulkActions: lang === "tr" ? "Toplu İşlemler" : lang === "de" ? "Massenaktionen" : "Bulk Actions",
      activate: lang === "tr" ? "Aktifleştir" : lang === "de" ? "Aktivieren" : "Activate",
      deactivate: lang === "tr" ? "Devre Dışı Bırak" : lang === "de" ? "Deaktivieren" : "Deactivate",
      delete: lang === "tr" ? "Sil" : lang === "de" ? "Löschen" : "Delete",
    },
    filters: {
      search: lang === "tr" ? "Kullanıcı ara..." : lang === "de" ? "Benutzer suchen..." : "Search users...",
      role: lang === "tr" ? "Rol" : lang === "de" ? "Rolle" : "Role",
      department: lang === "tr" ? "Departman" : lang === "de" ? "Abteilung" : "Department",
      status: lang === "tr" ? "Durum" : lang === "de" ? "Status" : "Status",
      all: lang === "tr" ? "Tümü" : lang === "de" ? "Alle" : "All",
    },
    table: {
      user: lang === "tr" ? "Kullanıcı" : lang === "de" ? "Benutzer" : "User",
      role: lang === "tr" ? "Rol" : lang === "de" ? "Rolle" : "Role",
      department: lang === "tr" ? "Departman" : lang === "de" ? "Abteilung" : "Department",
      status: lang === "tr" ? "Durum" : lang === "de" ? "Status" : "Status",
      lastActive: lang === "tr" ? "Son Aktif" : lang === "de" ? "Zuletzt aktiv" : "Last Active",
      tests: lang === "tr" ? "Testler" : lang === "de" ? "Tests" : "Tests",
      actions: lang === "tr" ? "İşlemler" : lang === "de" ? "Aktionen" : "Actions",
    },
    modal: {
      addUser: lang === "tr" ? "Yeni Kullanıcı Ekle" : lang === "de" ? "Neuen Benutzer hinzufügen" : "Add New User",
      editUser: lang === "tr" ? "Kullanıcıyı Düzenle" : lang === "de" ? "Benutzer bearbeiten" : "Edit User",
      deleteUser: lang === "tr" ? "Kullanıcıyı Sil" : lang === "de" ? "Benutzer löschen" : "Delete User",
      viewUser: lang === "tr" ? "Kullanıcı Detayları" : lang === "de" ? "Benutzerdetails" : "User Details",
      firstName: lang === "tr" ? "Ad" : lang === "de" ? "Vorname" : "First Name",
      lastName: lang === "tr" ? "Soyad" : lang === "de" ? "Nachname" : "Last Name",
      email: lang === "tr" ? "E-posta" : lang === "de" ? "E-Mail" : "Email",
      role: lang === "tr" ? "Rol" : lang === "de" ? "Rolle" : "Role",
      department: lang === "tr" ? "Departman" : lang === "de" ? "Abteilung" : "Department",
      permissions: lang === "tr" ? "İzinler" : lang === "de" ? "Berechtigungen" : "Permissions",
      cancel: lang === "tr" ? "İptal" : lang === "de" ? "Abbrechen" : "Cancel",
      save: lang === "tr" ? "Kaydet" : lang === "de" ? "Speichern" : "Save",
      deleteConfirm:
        lang === "tr"
          ? "Bu kullanıcıyı silmek istediğinizden emin misiniz?"
          : lang === "de"
          ? "Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?"
          : "Are you sure you want to delete this user?",
      deleteWarning:
        lang === "tr"
          ? "Bu işlem geri alınamaz."
          : lang === "de"
          ? "Diese Aktion kann nicht rückgängig gemacht werden."
          : "This action cannot be undone.",
    },
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === "all" || user.roleType === selectedRole;
    const matchesDepartment =
      selectedDepartment === "All Departments" || user.department === selectedDepartment;
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  // Handlers
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const handleSelectUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleOpenModal = (type: ModalType, user?: User) => {
    setModalType(type);
    if (user) {
      setCurrentUser(user);
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        roleType: user.roleType,
        department: user.department,
        permissions: user.permissions,
      });
    } else {
      setCurrentUser(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        roleType: "qa",
        department: "Quality Assurance",
        permissions: [],
      });
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setCurrentUser(null);
  };

  const handleSaveUser = () => {
    if (modalType === "add") {
      const newUser: User = {
        id: users.length + 1,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        roleType: formData.roleType,
        department: formData.department,
        status: "active",
        avatar: `${formData.firstName[0]}${formData.lastName[0]}`,
        color: roleTypes.find((r) => r.value === formData.roleType)?.color || "#868E96",
        joinDate: new Date().toISOString().split("T")[0],
        lastActive: "Just now",
        testsRun: 0,
        permissions: formData.permissions,
      };
      setUsers([...users, newUser]);
    } else if (modalType === "edit" && currentUser) {
      setUsers(
        users.map((u) =>
          u.id === currentUser.id
            ? {
                ...u,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                role: formData.role,
                roleType: formData.roleType,
                department: formData.department,
                permissions: formData.permissions,
              }
            : u
        )
      );
    }
    handleCloseModal();
  };

  const handleDeleteUser = () => {
    if (currentUser) {
      setUsers(users.filter((u) => u.id !== currentUser.id));
      handleCloseModal();
    }
  };

  const handleToggleStatus = (user: User) => {
    setUsers(
      users.map((u) =>
        u.id === user.id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u
      )
    );
  };

  const handleBulkActivate = () => {
    setUsers(users.map((u) => (selectedUsers.includes(u.id) ? { ...u, status: "active" } : u)));
    setSelectedUsers([]);
  };

  const handleBulkDeactivate = () => {
    setUsers(users.map((u) => (selectedUsers.includes(u.id) ? { ...u, status: "inactive" } : u)));
    setSelectedUsers([]);
  };

  const handleBulkDelete = () => {
    setUsers(users.filter((u) => !selectedUsers.includes(u.id)));
    setSelectedUsers([]);
  };

  const overviewCards = [
    {
      label: t.stats.total,
      value: userManagementStats.totalUsers.toString(),
      delta: undefined,
      deltaLabel: `${userManagementStats.activeUsers} ${t.stats.active.toLowerCase()}`,
      icon: Users,
      color: primary,
      bg: "#EEF2FF",
    },
    {
      label: t.stats.active,
      value: userManagementStats.activeUsers.toString(),
      delta: undefined,
      deltaLabel: `${((userManagementStats.activeUsers / userManagementStats.totalUsers) * 100).toFixed(0)}% active rate`,
      icon: CheckCircle2,
      color: success,
      bg: "#EBFBEE",
    },
    {
      label: t.stats.inactive,
      value: userManagementStats.inactiveUsers.toString(),
      delta: undefined,
      deltaLabel: `${userManagementStats.inactiveUsers} need attention`,
      icon: XCircle,
      color: danger,
      bg: "#FFF5F5",
    },
    {
      label: t.stats.roles,
      value: "4",
      delta: undefined,
      deltaLabel: `${userManagementStats.admins} admins`,
      icon: Shield,
      color: warning,
      bg: "#FFF9DB",
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

          {/* Main Content */}
          <div className="rounded-2xl border border-gray-100 overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
            {/* Toolbar */}
            <div className="p-5 border-b border-gray-100">
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
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {roleTypes.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <option value="all">{t.filters.all} {t.filters.status}</option>
                    <option value="active">{t.stats.active}</option>
                    <option value="inactive">{t.stats.inactive}</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal("add")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white hover:opacity-90 transition-opacity cursor-pointer"
                    style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                  >
                    <UserPlus style={{ width: "16px", height: "16px" }} />
                    {t.actions.addUser}
                  </button>

                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <Download style={{ width: "16px", height: "16px" }} />
                    {t.actions.export}
                  </button>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedUsers.length > 0 && (
                <div className="mt-4 flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "#EEF2FF" }}>
                  <p className="text-sm" style={{ color: primary, fontFamily: "Inter, sans-serif" }}>
                    {selectedUsers.length} {lang === "tr" ? "kullanıcı seçildi" : lang === "de" ? "Benutzer ausgewählt" : "users selected"}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleBulkActivate}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white cursor-pointer"
                      style={{ backgroundColor: success, fontFamily: "Inter, sans-serif" }}
                    >
                      <Power style={{ width: "12px", height: "12px" }} />
                      {t.actions.activate}
                    </button>
                    <button
                      onClick={handleBulkDeactivate}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white cursor-pointer"
                      style={{ backgroundColor: warning, fontFamily: "Inter, sans-serif" }}
                    >
                      <PowerOff style={{ width: "12px", height: "12px" }} />
                      {t.actions.deactivate}
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white cursor-pointer"
                      style={{ backgroundColor: danger, fontFamily: "Inter, sans-serif" }}
                    >
                      <Trash2 style={{ width: "12px", height: "12px" }} />
                      {t.actions.delete}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: bg }}>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.table.user}
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.table.role}
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.table.department}
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.table.status}
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.table.lastActive}
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.table.tests}
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.table.actions}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs shrink-0"
                            style={{ backgroundColor: user.color, fontFamily: "Inter, sans-serif" }}
                          >
                            {user.avatar}
                          </div>
                          <div>
                            <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <RoleBadge roleType={user.roleType} label={user.role} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700 whitespace-nowrap" style={{ fontFamily: "Inter, sans-serif" }}>
                          {user.department}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-colors"
                          style={{
                            backgroundColor: user.status === "active" ? "#EBFBEE" : "#FFF5F5",
                            color: user.status === "active" ? success : danger,
                            borderColor: user.status === "active" ? "#C3FAE8" : "#FFE3E3",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          {user.status === "active" ? (
                            <CheckCircle2 style={{ width: "12px", height: "12px" }} />
                          ) : (
                            <XCircle style={{ width: "12px", height: "12px" }} />
                          )}
                          {user.status === "active" ? t.stats.active : t.stats.inactive}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500 whitespace-nowrap" style={{ fontFamily: "Inter, sans-serif" }}>
                          {user.lastActive}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700 whitespace-nowrap" style={{ fontFamily: "Inter, sans-serif" }}>
                          {user.testsRun.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenModal("view", user)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 cursor-pointer"
                          >
                            <Eye style={{ width: "14px", height: "14px" }} />
                          </button>
                          <button
                            onClick={() => handleOpenModal("edit", user)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 cursor-pointer"
                          >
                            <Edit2 style={{ width: "14px", height: "14px" }} />
                          </button>
                          <button
                            onClick={() => handleOpenModal("delete", user)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 style={{ width: "14px", height: "14px" }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users style={{ width: "48px", height: "48px", color: "#D1D5DB", margin: "0 auto 12px" }} />
                  <p className="text-sm text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                    {lang === "tr" ? "Kullanıcı bulunamadı" : lang === "de" ? "Keine Benutzer gefunden" : "No users found"}
                  </p>
                </div>
              )}
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
                {modalType === "add" && t.modal.addUser}
                {modalType === "edit" && t.modal.editUser}
                {modalType === "delete" && t.modal.deleteUser}
                {modalType === "view" && t.modal.viewUser}
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
              {(modalType === "add" || modalType === "edit") && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.modal.firstName}
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.modal.lastName}
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.modal.email}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.modal.role}
                      </label>
                      <select
                        value={formData.roleType}
                        onChange={(e) => setFormData({ ...formData, roleType: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {roleTypes.filter((r) => r.value !== "all").map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.modal.department}
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {departments.filter((d) => d !== "All Departments").map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.modal.permissions}
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 rounded-lg border border-gray-200">
                      {permissions.map((perm) => (
                        <label key={perm.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(perm.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, permissions: [...formData.permissions, perm.id] });
                              } else {
                                setFormData({
                                  ...formData,
                                  permissions: formData.permissions.filter((p) => p !== perm.id),
                                });
                              }
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span style={{ fontFamily: "Inter, sans-serif" }}>{perm.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {modalType === "view" && currentUser && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl"
                      style={{ backgroundColor: currentUser.color, fontFamily: "Inter, sans-serif" }}
                    >
                      {currentUser.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg text-gray-900 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                        {currentUser.firstName} {currentUser.lastName}
                      </h3>
                      <RoleBadge roleType={currentUser.roleType} label={currentUser.role} size="md" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.modal.email}
                      </p>
                      <p className="text-sm text-gray-900 flex items-center gap-2" style={{ fontFamily: "Inter, sans-serif" }}>
                        <Mail style={{ width: "14px", height: "14px" }} />
                        {currentUser.email}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.modal.department}
                      </p>
                      <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                        {currentUser.department}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.table.status}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: currentUser.status === "active" ? success : danger }}
                        />
                        <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                          {currentUser.status === "active" ? t.stats.active : t.stats.inactive}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.table.lastActive}
                      </p>
                      <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                        {currentUser.lastActive}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                        Joined Date
                      </p>
                      <p className="text-sm text-gray-900 flex items-center gap-2" style={{ fontFamily: "Inter, sans-serif" }}>
                        <Calendar style={{ width: "14px", height: "14px" }} />
                        {currentUser.joinDate}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                        Tests Run
                      </p>
                      <p className="text-sm text-gray-900 flex items-center gap-2" style={{ fontFamily: "Inter, sans-serif" }}>
                        <Activity style={{ width: "14px", height: "14px" }} />
                        {currentUser.testsRun.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                      {t.modal.permissions}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.permissions.map((permId) => {
                        const perm = permissions.find((p) => p.id === permId);
                        return perm ? (
                          <span
                            key={permId}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700"
                            style={{ backgroundColor: "#F8F9FA", fontFamily: "Inter, sans-serif" }}
                          >
                            {perm.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              )}

              {modalType === "delete" && currentUser && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: "#FFF5F5" }}>
                    <AlertTriangle style={{ width: "24px", height: "24px", color: danger }} />
                    <div>
                      <p className="text-sm text-gray-900 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.modal.deleteConfirm}
                      </p>
                      <p className="text-xs text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                        {t.modal.deleteWarning}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm"
                        style={{ backgroundColor: currentUser.color, fontFamily: "Inter, sans-serif" }}
                      >
                        {currentUser.avatar}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                          {currentUser.firstName} {currentUser.lastName}
                        </p>
                        <p className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1" style={{ fontFamily: "Inter, sans-serif" }}>
                      <p>• {currentUser.testsRun.toLocaleString()} tests run will be archived</p>
                      <p>• All permissions will be revoked</p>
                      <p>• User data will be permanently deleted</p>
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
                {t.modal.cancel}
              </button>

              {modalType === "delete" ? (
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: danger, fontFamily: "Inter, sans-serif" }}
                >
                  <Trash2 style={{ width: "14px", height: "14px" }} />
                  {t.actions.delete}
                </button>
              ) : modalType !== "view" ? (
                <button
                  onClick={handleSaveUser}
                  className="px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: primary, fontFamily: "Inter, sans-serif" }}
                >
                  <Check style={{ width: "14px", height: "14px" }} />
                  {t.modal.save}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}