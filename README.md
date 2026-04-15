# React + TypeScript + Vite

A minimal React app using Vite, TypeScript, Tailwind, and ESLint.

## Quick Start

1. Clone the repository

```bash
git clone https://github.com/<your-org>/<your-repo>.git
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

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev and build performance. To add it, see [React Compiler installation](https://react.dev/learn/react-compiler/installation).

## ESLint configuration

If you want type-aware linting in a production application, update your ESLint config to use `tse` recommended type-checked rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      // or use stricter rules:
      // tseslint.configs.strictTypeChecked,
      // tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

You can also add React-specific lint rules from `eslint-plugin-react-x` and `eslint-plugin-react-dom`.
