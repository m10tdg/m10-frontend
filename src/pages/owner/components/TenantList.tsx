import { Building2 } from "lucide-react";

import type { TenantSummary } from "@/entities/auth";
import type { OwnerTranslations } from "@/shared/config/translations/owner";

interface TenantListProps {
  tenants: TenantSummary[];
  tx: OwnerTranslations["list"];
}

export function TenantList({ tenants, tx }: TenantListProps) {
  if (tenants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <Building2 className="w-8 h-8 mb-2" />
        <p className="text-sm">{tx.empty}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
            <th className="px-5 py-3 font-medium">{tx.tenant}</th>
            <th className="px-5 py-3 font-medium">{tx.admin}</th>
            <th className="px-5 py-3 font-medium text-right">{tx.users}</th>
            <th className="px-5 py-3 font-medium text-right">{tx.created}</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id} className="border-b border-gray-50 last:border-0">
              <td className="px-5 py-3.5">
                <p className="text-gray-900">{tenant.name}</p>
                <p className="text-xs text-gray-400">{tenant.slug}</p>
              </td>
              <td className="px-5 py-3.5 text-gray-600">
                {tenant.admin_email ?? <span className="text-gray-400">{tx.noAdmin}</span>}
              </td>
              <td className="px-5 py-3.5 text-right text-gray-600">{tenant.user_count}</td>
              <td className="px-5 py-3.5 text-right text-gray-500 whitespace-nowrap">
                {new Date(tenant.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
