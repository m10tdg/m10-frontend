// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home";
import { LoginPage } from "@/pages/Login";
import { RegisterPage } from "@/pages/Register";
import { AdminDashboard } from "@/pages/AdminDashboard";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/admin", element: <AdminDashboard /> },
]);