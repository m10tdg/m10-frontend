import { Link } from "react-router-dom";
import { ArrowRight, Building2, ShieldCheck, Users } from "lucide-react";

import { useLangStore } from "@/shared/stores/langStore";
import { ownerTranslations } from "@/shared/config/translations/owner";
import { listOwners, listTenants } from "@/features/owner/api";
import type { OwnerSummary, TenantSummary } from "@/entities/auth";
import { Notice } from "@/pages/owner/components/Notice";
import { RefreshButton } from "@/pages/owner/components/RefreshButton";
import { TenantList } from "@/pages/owner/components/TenantList";
import { useOwnerResource } from "@/pages/owner/useOwnerResource";

const RECENT_TENANT_COUNT = 5;

async function loadOverview() {
  const [tenants, owners] = await Promise.all([listTenants(), listOwners()]);
  return { tenants, owners };
}

const EMPTY: { tenants: TenantSummary[]; owners: OwnerSummary[] } = { tenants: [], owners: [] };

export function OwnerOverviewPage() {
  const { lang } = useLangStore();
  const tx = ownerTranslations[lang];
  const { data, loading, failed, reload } = useOwnerResource(loadOverview, EMPTY);

  const userCount = data.tenants.reduce((total, tenant) => total + tenant.user_count, 0);
  const stats = [
    { label: tx.overview.tenants, value: data.tenants.length, icon: Building2 },
    { label: tx.overview.users, value: userCount, icon: Users },
    { label: tx.overview.owners, value: data.owners.length, icon: ShieldCheck },
  ];

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{tx.overview.title}</h1>
          <p className="text-sm text-gray-500">{tx.overview.subtitle}</p>
        </div>
        <RefreshButton label={tx.refresh} loading={loading} onClick={reload} />
      </div>

      {failed && <Notice kind="error" className="mb-6">{tx.errors.requestFailed}</Notice>}

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900 tabular-nums">{loading ? "–" : value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-medium text-gray-900">{tx.overview.recentTenants}</h2>
          <Link
            to="/owner/tenants"
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
          >
            {tx.overview.viewAll}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <TenantList tenants={data.tenants.slice(0, RECENT_TENANT_COUNT)} tx={tx.list} />
      </section>
    </>
  );
}
