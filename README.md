# Grammar Check Frontend

A modern React-based frontend for the Grammar Check API. Built with React, TypeScript, Material-UI, and Vite.

## Features

- 🔐 User authentication (login/register)
- 📝 Image upload for handwriting analysis
- ✅ Grammar checking and correction
- 🎨 Modern, responsive UI with Material-UI
- 📦 State management with Zustand
- 🔄 Real-time updates with WebSockets

## Prerequisites

- Node.js 18+ and pnpm
- Grammar Check API backend running (see `API_EXAMPLES.md`)

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create a `.env` file in the root directory:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

3. Start the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## Project Structure

```
src/
├── app.tsx              # Main app component with routing
├── main.tsx             # Entry point with theme provider
├── pages/
│   └── login.tsx        # Login page with MUI form
├── stores/
│   └── authStore.ts     # Authentication state management
├── types/
│   └── User.ts          # TypeScript type definitions
└── utils/
    └── apiClient.ts     # Axios instance with interceptors
```

## Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Component library
- **React Hook Form** - Form handling
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router** - Routing
- **Vite** - Build tool

## API Integration

The app integrates with the Grammar Check API. See `API_EXAMPLES.md` for detailed API documentation.

Key features:

- JWT-based authentication with automatic token management
- Automatic token injection in API requests via Axios interceptors
- Automatic logout on 401 Unauthorized responses

## Vite Configuration

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
    globalIgnores(["dist"]),
    {
        files: ["**/*.{ts,tsx}"],
        extends: [
            // Other configs...

            // Remove tseslint.configs.recommended and replace with this
            tseslint.configs.recommendedTypeChecked,
            // Alternatively, use this for stricter rules
            tseslint.configs.strictTypeChecked,
            // Optionally, add this for stylistic rules
            tseslint.configs.stylisticTypeChecked,

            // Other configs...
        ],
        languageOptions: {
            parserOptions: {
                project: ["./tsconfig.node.json", "./tsconfig.app.json"],
                tsconfigRootDir: import.meta.dirname,
            },
            // other options...
        },
    },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
    globalIgnores(["dist"]),
    {
        files: ["**/*.{ts,tsx}"],
        extends: [
            // Other configs...
            // Enable lint rules for React
            reactX.configs["recommended-typescript"],
            // Enable lint rules for React DOM
            reactDom.configs.recommended,
        ],
        languageOptions: {
            parserOptions: {
                project: ["./tsconfig.node.json", "./tsconfig.app.json"],
                tsconfigRootDir: import.meta.dirname,
            },
            // other options...
        },
    },
]);
```
