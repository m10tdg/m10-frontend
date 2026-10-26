// Shapes returned by auth-service.
import type { PlatformOwner, User } from "@/shared/stores/types";

export interface TenantSummary {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  user_count: number;
  admin_email: string | null;
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
    password: string;
  };
}

export interface CreateTenantResponse {
  tenant: Omit<TenantSummary, "user_count" | "admin_email">;
  admin: Pick<User, "id" | "name" | "email" | "role">;
}
