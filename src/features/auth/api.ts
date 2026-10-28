// src/features/auth/api.ts
import { authServiceApi } from "@/shared/lib/api";
import type { AccountKind, PasswordSetupInfo, UserLoginResponse } from "@/entities/auth";

export async function signIn(email: string, password: string): Promise<UserLoginResponse> {
  const response = await authServiceApi.post<UserLoginResponse>("/auth/login", {
    email,
    password,
  });
  return response.data;
}

// Invitation links: look up whose link it is, then replace the generated password.
export async function getPasswordSetup(token: string): Promise<PasswordSetupInfo> {
  const response = await authServiceApi.get<PasswordSetupInfo>("/auth/password-setup", {
    params: { token },
  });
  return response.data;
}

export async function completePasswordSetup(
  token: string,
  password: string,
): Promise<{ kind: AccountKind; email: string }> {
  const response = await authServiceApi.post<{ kind: AccountKind; email: string }>(
    "/auth/password-setup",
    { token, password },
  );
  return response.data;
}
