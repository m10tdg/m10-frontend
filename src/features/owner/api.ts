// src/features/owner/api.ts
import { authServiceApi } from "@/shared/lib/api";
import { getApiErrorStatus } from "@/shared/lib/apiError";
import { useOwnerStore } from "@/shared/stores/owner-store";
import type {
  CreateTenantPayload,
  CreateTenantResponse,
  OwnerLoginResponse,
  TenantSummary,
} from "@/entities/auth";

function ownerHeaders() {
  return { Authorization: `Bearer ${useOwnerStore.getState().token}` };
}

// Ends the owner session when the server rejects the token, so the route guard
// sends the owner back to the sign-in page.
async function withOwnerSession<T>(request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (error) {
    if (getApiErrorStatus(error) === 401) useOwnerStore.getState().logout();
    throw error;
  }
}

export async function ownerSignIn(email: string, password: string): Promise<OwnerLoginResponse> {
  const response = await authServiceApi.post<OwnerLoginResponse>("/owner/login", {
    email,
    password,
  });
  return response.data;
}

export function listTenants(): Promise<TenantSummary[]> {
  return withOwnerSession(async () => {
    const response = await authServiceApi.get<{ items: TenantSummary[] }>("/owner/tenants", {
      headers: ownerHeaders(),
    });
    return response.data.items;
  });
}

export function createTenant(payload: CreateTenantPayload): Promise<CreateTenantResponse> {
  return withOwnerSession(async () => {
    const response = await authServiceApi.post<CreateTenantResponse>("/owner/tenants", payload, {
      headers: ownerHeaders(),
    });
    return response.data;
  });
}
