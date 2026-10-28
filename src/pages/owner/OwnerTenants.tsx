import { useState } from "react";

import { useLangStore } from "@/shared/stores/langStore";
import { ownerTranslations } from "@/shared/config/translations/owner";
import { listTenants } from "@/features/owner/api";
import type { CreateTenantResponse, TenantSummary } from "@/entities/auth";
import { CreateTenantForm } from "@/pages/owner/components/CreateTenantForm";
import { Notice } from "@/pages/owner/components/Notice";
import { RefreshButton } from "@/pages/owner/components/RefreshButton";
import { TenantList } from "@/pages/owner/components/TenantList";
import { useOwnerResource } from "@/pages/owner/useOwnerResource";

const NO_TENANTS: TenantSummary[] = [];

export function OwnerTenantsPage() {
  const { lang } = useLangStore();
  const tx = ownerTranslations[lang];
  const { data: tenants, loading, failed, reload } = useOwnerResource(listTenants, NO_TENANTS);
  const [created, setCreated] = useState<CreateTenantResponse | null>(null);

  const handleCreated = (result: CreateTenantResponse) => {
    setCreated(result);
    reload();
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{tx.tenants.title}</h1>
        <p className="text-sm text-gray-500">{tx.tenants.subtitle}</p>
      </div>

      {created && (
        <Notice kind="success" className="mb-6">
          {tx.form.created
            .replace("{tenant}", created.tenant.name)
            .replace("{email}", created.admin.email)}
        </Notice>
      )}

      <div className="grid gap-6 xl:grid-cols-[360px_1fr] items-start">
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-medium text-gray-900 mb-5">{tx.form.title}</h2>
          <CreateTenantForm tx={tx} onCreated={handleCreated} />
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm min-w-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-medium text-gray-900">
              {tx.tenants.title} <span className="text-gray-400">({tenants.length})</span>
            </h2>
            <RefreshButton label={tx.refresh} loading={loading} onClick={reload} />
          </div>

          {failed ? (
            <Notice kind="error" className="m-5">{tx.errors.requestFailed}</Notice>
          ) : (
            <TenantList tenants={tenants} tx={tx.list} />
          )}
        </section>
      </div>
    </>
  );
}
