# IRIS Translator - Monorepo

A modern LLM infrastructure project demonstrating "Skills" and "Minimal Compute Platforms" (MCP) concepts through a microservice-style architecture.

## 🏗️ Monorepo Structure

This project uses **npm workspaces** to manage a monorepo architecture:

```
iris-translator-monorepo/
├── packages/
│   ├── app/              # Main Vite + React application
│   │   ├── src/          # Application source code
│   │   ├── package.json  # App-specific dependencies
│   │   └── ...
│   ├── common/           # Shared utilities and configurations
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   └── translationModes.js
│   │   └── package.json
│   └── services/
│       └── stylist/      # LLM-based translation service
│           ├── api/
│           │   └── translate.js
│           ├── package.json
│           └── README.md
├── package.json          # Root workspace configuration
├── QUICKSTART.md         # Quick start guide
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

### `packages/common`

Shared package containing configuration and utilities used by both frontend and services:
- **translationModes.js** - Complete definitions of all translation modes organized by category
- Exported as `@iris-translator/common` for use across packages

### `packages/services/stylist`

LLM-based translation microservice:
- **API Endpoint:** POST `/api/translate` 
- **Purpose:** Handles all generative (prompt-based) translations
- **Technology:** Node.js + Google Gemini API
- **Deployment:** Serverless-ready (Vercel, Netlify, AWS Lambda, GCP)

See [packages/services/stylist/README.md](packages/services/stylist/README.md) for API documentation and [packages/services/stylist/ARCHITECTURE.md](packages/services/stylist/ARCHITECTURE.md) for design details.

## 🎯 Architecture

This monorepo demonstrates modern microservice architecture:

1. **Frontend (`@iris-translator/app`)** - React/Vite application for user interface
2. **Shared Common Package (`@iris-translator/common`)** - Shared configurations and utilities
3. **Stylist Service (`@iris-translator/stylist`)** - Independent LLM-based translation microservice

### Key Features

✨ **Separation of Concerns** - Frontend and backend services are independent  
✨ **Shared Configuration** - Single source of truth via common package  
✨ **Microservice Ready** - Services can be deployed independently  
✨ **Serverless Compatible** - Ready for Vercel, Netlify, AWS, GCP  
✨ **Type Safety** - Consistent mode definitions across all packages

### Quick Start

See [QUICKSTART.md](QUICKSTART.md) for a 5-minute setup guide.

For complete implementation details, see [STYLIST_SERVICE_SUMMARY.md](STYLIST_SERVICE_SUMMARY.md).

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
