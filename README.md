# IRIS Translator - Monorepo

A modern LLM infrastructure project demonstrating "Skills" and "Minimal Compute Platforms" (MCP) concepts through a microservice-style architecture.

## 🏗️ Monorepo Structure

This project uses **npm workspaces** to manage a monorepo architecture:

```
iris-translator-monorepo/
├── packages/
│   └── app/              # Main Vite + React application
│       ├── src/          # Application source code
│       ├── package.json  # App-specific dependencies
│       └── ...
├── package.json          # Root workspace configuration
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.0.0
- npm >= 7.0.0

### Installation

From the root directory, install all workspace dependencies:

```bash
npm install
```

This will install dependencies for all packages in the monorepo.

### Development

Run the development server:

```bash
npm run dev
```

This starts the Vite development server for the app workspace.

### Build

Build the application for production:

```bash
npm run build
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Lint

Run ESLint on the application:

```bash
npm run lint
```

## 📦 Workspaces

### `packages/app`

The main translator application built with:
- **Vite** - Fast build tool and dev server
- **React 18** - UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

See [packages/app/ARCHITECTURE.md](packages/app/ARCHITECTURE.md) for detailed architecture documentation.

## 🎯 Future Architecture

This monorepo structure enables:

1. **Orchestrator** - The Next.js/Vite app's backend coordinating services
2. **Independent Skills** - Separate microservices for specific functions:
   - Translation service
   - Encoding/decoding service
   - Additional AI-powered capabilities

Each skill can be deployed independently as serverless functions or containers.

## 🧪 Working with Workspaces

### Run commands in specific workspace

```bash
npm run <script> --workspace=packages/app
```

### Install dependencies in specific workspace

```bash
npm install <package> --workspace=packages/app
```

### Add a new workspace

1. Create a new directory under `packages/`
2. Add a `package.json` with a unique name (e.g., `@iris-translator/translate-service`)
3. Run `npm install` from the root

## 📝 License

See LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please ensure all workspaces build successfully before submitting PRs.
