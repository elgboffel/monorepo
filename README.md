# monorepo Monorepo

A minimal monorepo setup using pnpm workspaces, Turborepo, and TypeScript.

## Structure

```
├── apps/
│   ├── web/                 # Example web application (TypeScript)
│   │   ├── src/             # TypeScript source files
│   │   ├── tsconfig.json    # TypeScript configuration
│   │   └── package.json     # Package configuration
│   └── api/                 # Express.js API server (TypeScript)
│       ├── src/             # TypeScript source files
│       ├── tsconfig.json    # TypeScript configuration
│       └── package.json     # Package configuration
├── packages/
│   └── shared/              # Shared package/library (TypeScript)
│       ├── src/             # TypeScript source files (no build step)
│       └── package.json     # Package configuration
├── package.json             # Root package.json with Turborepo
├── pnpm-workspace.yaml      # pnpm workspace configuration
├── tsconfig.json            # Root TypeScript configuration
└── turbo.json              # Turborepo pipeline configuration
```

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Build all apps (packages are used directly as TypeScript):

   ```bash
   pnpm build
   ```

3. Run in development mode:

   ```bash
   pnpm dev
   ```

   This will start both the web app and API server.

4. Run individual apps:

   ```bash
   # Run only the API server
   cd apps/api && pnpm dev

   # Run only the web app
   cd apps/web && pnpm dev
   ```

5. Clean all build outputs:

   ```bash
   pnpm clean
   ```

6. Type check all packages:
   ```bash
   pnpm type-check
   ```

## Commands

### Development

- `pnpm build` - Build all apps (packages are used directly as TypeScript)
- `pnpm dev` - Run all apps in development mode
- `pnpm clean` - Clean all app build outputs
- `pnpm type-check` - Type check all TypeScript code (apps and packages)

### Code Quality

- `pnpm lint` - Lint all TypeScript and JavaScript files
- `pnpm lint:fix` - Lint and automatically fix issues
- `pnpm format` - Format all files with Prettier
- `pnpm format:check` - Check if files are properly formatted

### Dependency Management

- `pnpm deps:check` - Check for dependency version mismatches across packages
- `pnpm deps:fix` - Automatically fix dependency version mismatches

## API Endpoints

The Express.js API server (when running) provides the following endpoints:

- `GET /` - Returns a welcome message with version and timestamp
- `GET /health` - Health check endpoint
- `GET /api/message` - Returns a message from the shared package

Default server runs on `http://localhost:3000`

## Development Tools

This monorepo includes a comprehensive set of development tools:

- **Prettier** - Code formatting with consistent style
- **ESLint** - TypeScript/JavaScript linting with recommended rules
- **EditorConfig** - Consistent editor settings across team members
- **Husky** - Git hooks for pre-commit quality checks
- **Syncpack** - Ensures consistent dependency versions across packages

## Package Architecture

- **Apps** (`apps/`): Built applications that compile TypeScript to JavaScript
- **Packages** (`packages/`): Internal libraries used directly as TypeScript source files
- Packages use modern `exports` field to expose all files (no build step required)
- Apps use TypeScript path mapping to import from packages

### Package Import Examples

```typescript
// Import from main helpers file
import { getMessage } from "common";

// Import from specific files
import { formatDate, constants } from "common/utils";
```

## Adding New Packages

1. Create a new directory in `apps/` or `packages/`
2. For apps: Add build scripts and TypeScript configuration
3. For packages: Export TypeScript files directly in package.json
4. The workspace will automatically include it
