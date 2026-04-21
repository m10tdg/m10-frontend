// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home/home";
import { LoginPage } from "@/pages/auth/Login";
import { RegisterPage } from "@/pages/auth/Register";
import { AdminDashboard } from "@/pages/adminDashboard/AdminDashboard";
import { ProfilePage } from "@/pages/profile/Profile";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/admin", element: <AdminDashboard /> },
  {path: "/profile", element: <ProfilePage /> },
]);