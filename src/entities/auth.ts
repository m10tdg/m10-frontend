// Shapes returned by auth-service.
import type { PlatformOwner, User } from "@/shared/stores/types";

export interface TenantAdmin {
  id: string;
  name: string;
  email: string;
}

export interface TenantSummary {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  user_count: number;
  admins: TenantAdmin[];
}

export interface OwnerSummary extends PlatformOwner {
  created_at: string;
}

export interface UserLoginResponse {
  token: string;
  user: User;
}

export interface OwnerLoginResponse {
  token: string;
  owner: PlatformOwner;
}

export interface CreateTenantPayload {
  name: string;
  slug: string;
  admin: {
    name: string;
    email: string;
  };
}

export interface CreateTenantResponse {
  tenant: Omit<TenantSummary, "user_count" | "admins">;
  admin: Pick<User, "id" | "name" | "email" | "role">;
}

export interface CreateOwnerPayload {
  name: string;
  email: string;
}

export type AccountKind = "user" | "owner";

export interface PasswordSetupInfo {
  kind: AccountKind;
  name: string;
  email: string;
}
