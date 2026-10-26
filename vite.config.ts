// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    server: {
      proxy: {
        '/project-api': {
          target: env.VITE_PROJECT_SERVICE_URL || 'http://localhost:4001',
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/project-api/, ''),
        },
        '/document-api': {
          target: env.VITE_DOCUMENT_SERVICE_URL || 'http://localhost:4002',
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/document-api/, ''),
        },
        '/run-api': {
          target: env.VITE_RUN_SERVICE_URL || 'http://localhost:4003',
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/run-api/, ''),
        },
        '/dashboard-api': {
          target: env.VITE_DASHBOARD_SERVICE_URL || 'http://localhost:4004',
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/dashboard-api/, ''),
        },
        '/auth-api': {
          target: env.VITE_AUTH_SERVICE_URL || 'http://localhost:4005',
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/auth-api/, ''),
        },
      },
    },
  }
})