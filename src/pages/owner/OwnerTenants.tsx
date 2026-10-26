import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

import { useLangStore } from "@/shared/stores/langStore";
import { useOwnerStore } from "@/shared/stores/owner-store";
import { ownerTranslations } from "@/shared/config/translations/owner";
import { bg } from "@/shared/styles/colors";
import { listTenants } from "@/features/owner/api";
import type { CreateTenantResponse, TenantSummary } from "@/entities/auth";
import { OwnerHeader } from "@/pages/owner/components/OwnerHeader";
import { CreateTenantForm } from "@/pages/owner/components/CreateTenantForm";
import { TenantList } from "@/pages/owner/components/TenantList";

export function OwnerTenantsPage() {
  const { lang } = useLangStore();
  const tx = ownerTranslations[lang];
  const navigate = useNavigate();
  const owner = useOwnerStore((state) => state.owner);
  const logout = useOwnerStore((state) => state.logout);

  const [tenants, setTenants] = useState<TenantSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [created, setCreated] = useState<CreateTenantResponse | null>(null);

  const loadTenants = useCallback(async () => {
    setLoading(true);
    try {
      setTenants(await listTenants());
      setLoadFailed(false);
    } catch {
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  const handleCreated = (result: CreateTenantResponse) => {
    setCreated(result);
    loadTenants();
  };

  const handleSignOut = () => {
    logout();
    navigate("/owner/login", { replace: true });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: bg, fontFamily: "Inter, sans-serif" }}>
      <OwnerHeader
        owner={owner}
        badge={tx.badge}
        signOutLabel={tx.panel.signOut}
        onSignOut={handleSignOut}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{tx.panel.title}</h1>
          <p className="text-sm text-gray-500">{tx.panel.subtitle}</p>
        </div>

        {created && (
          <div role="status" className="mb-6 flex items-center gap-2.5 p-3.5 rounded-xl text-sm bg-green-50 text-green-700">
            <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
            <span>
              {tx.form.created
                .replace("{tenant}", created.tenant.name)
                .replace("{email}", created.admin.email)}
            </span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[380px_1fr] items-start">
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-medium text-gray-900 mb-5">{tx.form.title}</h2>
            <CreateTenantForm tx={tx} onCreated={handleCreated} />
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-medium text-gray-900">
                {tx.panel.title} <span className="text-gray-400">({tenants.length})</span>
              </h2>
              <button
                onClick={loadTenants}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                {tx.panel.refresh}
              </button>
            </div>

            {loadFailed ? (
              <div role="alert" className="m-5 flex items-center gap-2.5 p-3.5 rounded-xl text-sm bg-red-50 text-red-700">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{tx.errors.requestFailed}</span>
              </div>
            ) : (
              <TenantList tenants={tenants} tx={tx.list} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
