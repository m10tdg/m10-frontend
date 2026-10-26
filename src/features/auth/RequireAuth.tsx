// src/features/auth/RequireAuth.tsx
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useUserStore } from "@/shared/stores/user-store";
import { isTokenExpired } from "@/shared/lib/jwt";

// Renders the nested routes only for a signed-in tenant user.
export function RequireAuth() {
  const location = useLocation();
  const token = useUserStore((state) => state.token);
  const logout = useUserStore((state) => state.logout);
  const expired = isTokenExpired(token);

  useEffect(() => {
    if (token && expired) logout();
  }, [token, expired, logout]);

  if (expired) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
