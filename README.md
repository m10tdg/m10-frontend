# M10 Frontend

This document is a guidance for cloning M10 Frontend project from GitHub and running it locally.

## Quick Start

1. Clone the repository

```bash
git clone https://github.com/m10tdg/m10-frontend.git
cd m10-frontend
```

2. Install dependencies

```bash
pnpm install
```

3. Start the development server

```bash
pnpm dev
```

4. Open the app in your browser

Visit `http://localhost:5173`

## Common commands

- `pnpm dev` - start the development server
- `pnpm build` - build the app for production
- `pnpm preview` - preview the production build locally
- `pnpm lint` - run ESLint across the project

## Notes

- This project uses Vite for fast development and HMR.
- The source code lives in `src/`.
- Static assets are served from `public/`.

## MyTester service configuration

The MyTester admin page uses the Vite development-server proxies `/project-api`, `/document-api`, `/run-api`, and `/dashboard-api`, targeting `http://localhost:4001`, `http://localhost:4002`, `http://localhost:4003`, and `http://localhost:4004`, respectively. Override those service addresses with `VITE_PROJECT_SERVICE_URL`, `VITE_DOCUMENT_SERVICE_URL`, `VITE_RUN_SERVICE_URL`, and `VITE_DASHBOARD_SERVICE_URL` in a local `.env` file. For a production deployment, configure these variables to the service URLs and allow cross-origin requests from the frontend origin. `VITE_TENANT_ID` can override the seeded demo tenant ID (`11111111-1111-1111-1111-111111111111`).

MyTester loads each project's test history from the dashboard service's `GET /projects/:projectId/runs` endpoint. For reports, it opens the dashboard service's time-limited S3 `downloadUrl` in a new tab; HTML reports are opened directly in the browser. The dashboard service must be running for project history and report links to load.

The public Contact page submits messages through the backend service at `/contact`; the Vite proxy uses `/backend-api` and targets `http://localhost:4006` by default. The owner console's **Messages** page reads and updates message status through owner-authenticated endpoints and sends replies to the sender using the backend service's configured SMTP transport. The public **Blog** page reads published articles from the same service; platform owners can create, edit, publish, and unpublish posts from the owner console's **Blog** page. Override the service address with `VITE_BACKEND_SERVICE_URL` in a local `.env` file.
