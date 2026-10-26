// src/features/auth/api.ts
import { authServiceApi } from "@/shared/lib/api";
import type { UserLoginResponse } from "@/entities/auth";

export async function signIn(email: string, password: string): Promise<UserLoginResponse> {
  const response = await authServiceApi.post<UserLoginResponse>("/auth/login", {
    email,
    password,
  });
  return response.data;
}
