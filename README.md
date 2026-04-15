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
