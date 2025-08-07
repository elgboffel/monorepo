# Grably Monorepo Coding Standards

This document outlines the coding standards and conventions for the Grably monorepo to ensure consistency, maintainability, and code quality across all packages and applications.

## TypeScript Standards

### Type vs Interface Usage

**Default Rule**: Use `type` declarations instead of `interface` declarations for all type definitions.

**Exception**: Only use `interface` when defining method contracts for classes that will implement them (i.e., when you have a class with methods that needs to implement an interface).

#### Examples

✅ **Correct - Use `type` for object shapes:**
```typescript
type UserConfig = {
  name: string;
  email: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
};

type ApiResponse<T> = {
  data: T;
  status: number;
  message?: string;
};
```

✅ **Correct - Use `interface` for class contracts:**
```typescript
interface DatabaseRepository {
  findById(id: string): Promise<Entity | null>;
  save(entity: Entity): Promise<Entity>;
  delete(id: string): Promise<void>;
}

class UserRepository implements DatabaseRepository {
  async findById(id: string): Promise<User | null> {
    // implementation
  }
  // ... other methods
}
```

❌ **Incorrect - Don't use `interface` for simple object shapes:**
```typescript
// Don't do this
interface UserConfig {
  name: string;
  email: string;
}

// Use this instead
type UserConfig = {
  name: string;
  email: string;
};
```

#### Rationale

- **Consistency**: Using `type` as the default provides a consistent approach to type definitions
- **Flexibility**: `type` declarations support union types, intersections, and computed properties more naturally
- **Clarity**: Reserving `interface` for class contracts makes the intent clearer when reading code
- **Modern TypeScript**: Current TypeScript best practices favor `type` for most use cases

### Other TypeScript Conventions

- Use explicit return types for public functions and methods
- Prefer `const` assertions for immutable data structures
- Use strict TypeScript configuration with `noImplicitAny`, `strictNullChecks`, etc.
- Avoid `any` type; use `unknown` when the type is truly unknown

## Code Formatting

### Prettier Configuration

The monorepo uses Prettier with the following configuration:

- **Semi-colons**: Always use semicolons
- **Quotes**: Double quotes for strings
- **Trailing commas**: ES5 compatible (objects, arrays)
- **Print width**: 80 characters
- **Tab width**: 2 spaces
- **Arrow function parentheses**: Avoid when possible (`x => x` not `(x) => x`)

### ESLint Rules

Key ESLint rules enforced across the monorepo:

- Unused variables must be prefixed with `_` if intentionally unused
- `console.log` statements are allowed (disabled `no-console`)
- Prefer `const` over `let` when variables are not reassigned
- No `var` declarations (use `const` or `let`)

## File and Directory Structure

### Package Organization

```
packages/
├── shared/           # Shared utilities and types
├── ui/              # React UI components
├── database/        # Database utilities and entities
└── styles-config/   # Tailwind CSS configuration
```

### Import Conventions

- Use workspace references for internal packages: `@project/package-name`
- Group imports: external packages first, then internal packages, then relative imports
- Use specific imports when possible: `import { specific } from 'package'`

### File Naming

- Use kebab-case for file names: `user-service.ts`, `api-client.ts`
- Use PascalCase for React components: `UserProfile.tsx`, `ApiClient.tsx`
- Use camelCase for utility functions and variables

## Package Management

### Dependency Management

- Use `pnpm` as the package manager
- Use `workspace:*` pattern for internal dependencies
- Run `pnpm deps:check` to verify dependency consistency
- Use `syncpack` to maintain version alignment across packages

### Scripts and Commands

Standard scripts available in all packages:

- `pnpm build` - Build the package/app
- `pnpm dev` - Run in development mode
- `pnpm type-check` - TypeScript type checking
- `pnpm lint` - ESLint checking
- `pnpm format` - Prettier formatting

## Git and Version Control

### Commit Standards

- Use conventional commit format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Keep commit messages concise but descriptive

### Pre-commit Hooks

The following checks run automatically before each commit:

1. Prettier format checking
2. ESLint linting
3. TypeScript type checking
4. Dependency consistency checking

## Testing Standards

### Test File Organization

- Place test files adjacent to source files with `.test.ts` or `.spec.ts` suffix
- Use descriptive test names that explain the expected behavior
- Group related tests using `describe` blocks

### Testing Conventions

- Write unit tests for utility functions and business logic
- Write integration tests for API endpoints and database operations
- Mock external dependencies in unit tests
- Use TypeScript for all test files

## Documentation

### Code Documentation

- Use JSDoc comments for public APIs and complex functions
- Include examples in documentation when helpful
- Document type parameters and return types for generic functions

### README Files

- Each package should have a comprehensive README.md
- Include installation, usage examples, and API documentation
- Keep documentation up to date with code changes

## Performance and Best Practices

### TypeScript Performance

- Use `type` imports when importing only for type checking: `import type { User } from './types'`
- Avoid deep nesting in type definitions
- Use index signatures sparingly

### Bundle Size

- Use tree-shaking friendly exports
- Avoid importing entire libraries when only specific functions are needed
- Monitor bundle sizes in applications

## Enforcement

These standards are enforced through:

1. **ESLint configuration** - Automated linting rules
2. **Prettier configuration** - Consistent code formatting
3. **TypeScript compiler** - Type safety and consistency
4. **Pre-commit hooks** - Automated checks before commits
5. **Code reviews** - Manual verification of standards compliance

## Updates and Changes

This document should be updated when:

- New coding standards are adopted
- Existing standards are modified
- New tools or configurations are added to the monorepo

All changes to coding standards should be discussed with the team and documented in this file.
