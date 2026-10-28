import { useState } from "react";
import { ShieldCheck } from "lucide-react";

import { useLangStore } from "@/shared/stores/langStore";
import { useOwnerStore } from "@/shared/stores/owner-store";
import { ownerTranslations } from "@/shared/config/translations/owner";
import { listOwners } from "@/features/owner/api";
import type { OwnerSummary } from "@/entities/auth";
import { CreateOwnerForm } from "@/pages/owner/components/CreateOwnerForm";
import { Notice } from "@/pages/owner/components/Notice";
import { RefreshButton } from "@/pages/owner/components/RefreshButton";
import { useOwnerResource } from "@/pages/owner/useOwnerResource";

const NO_OWNERS: OwnerSummary[] = [];

export function OwnerOwnersPage() {
  const { lang } = useLangStore();
  const tx = ownerTranslations[lang];
  const currentOwnerId = useOwnerStore((state) => state.owner?.id);
  const { data: owners, loading, failed, reload } = useOwnerResource(listOwners, NO_OWNERS);
  const [createdEmail, setCreatedEmail] = useState("");

  const handleCreated = (owner: OwnerSummary) => {
    setCreatedEmail(owner.email);
    reload();
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{tx.owners.title}</h1>
        <p className="text-sm text-gray-500">{tx.owners.subtitle}</p>
      </div>

      {createdEmail && (
        <Notice kind="success" className="mb-6">
          {tx.owners.created.replace("{email}", createdEmail)}
        </Notice>
      )}

      <div className="grid gap-6 xl:grid-cols-[360px_1fr] items-start">
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-medium text-gray-900 mb-5">{tx.owners.formTitle}</h2>
          <CreateOwnerForm tx={tx} onCreated={handleCreated} />
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm min-w-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-medium text-gray-900">
              {tx.owners.listTitle} <span className="text-gray-400">({owners.length})</span>
            </h2>
            <RefreshButton label={tx.refresh} loading={loading} onClick={reload} />
          </div>

          {failed ? (
            <Notice kind="error" className="m-5">{tx.errors.requestFailed}</Notice>
          ) : (
            <ul className="divide-y divide-gray-50">
              {owners.map((owner) => (
                <li key={owner.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 text-gray-700 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900 truncate">
                      {owner.name}
                      {owner.id === currentOwnerId && (
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
                          {tx.owners.you}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{owner.email}</p>
                  </div>
                  <p className="text-xs text-gray-500 whitespace-nowrap">
                    {tx.owners.added} {new Date(owner.created_at).toLocaleDateString(lang)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
