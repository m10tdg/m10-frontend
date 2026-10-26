// src/features/owner/RequireOwner.tsx
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useOwnerStore } from "@/shared/stores/owner-store";
import { isTokenExpired } from "@/shared/lib/jwt";

// Renders the nested routes only for a signed-in M10 platform owner.
export function RequireOwner() {
  const token = useOwnerStore((state) => state.token);
  const logout = useOwnerStore((state) => state.logout);
  const expired = isTokenExpired(token);

  useEffect(() => {
    if (token && expired) logout();
  }, [token, expired, logout]);

  if (expired) return <Navigate to="/owner/login" replace />;
  return <Outlet />;
}
