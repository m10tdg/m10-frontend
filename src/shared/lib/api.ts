// src/shared/lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const projectServiceApi = axios.create({
  baseURL: import.meta.env.VITE_PROJECT_SERVICE_URL || "/project-api",
});

export const documentServiceApi = axios.create({
  baseURL: import.meta.env.VITE_DOCUMENT_SERVICE_URL || "/document-api",
});

export const runServiceApi = axios.create({
  baseURL: import.meta.env.VITE_RUN_SERVICE_URL || "/run-api",
});

export const dashboardServiceApi = axios.create({
  baseURL: import.meta.env.VITE_DASHBOARD_SERVICE_URL || "/dashboard-api",
});