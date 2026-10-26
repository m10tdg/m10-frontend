// src/features/auth/useTenantId.ts
import { useUserStore } from "@/shared/stores/user-store";

// Tenant of the signed-in user. Pages behind <RequireAuth /> always have one.
export function useTenantId(): string {
  return useUserStore((state) => state.currentUser?.tenant?.id ?? "");
}
