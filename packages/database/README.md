# @project/database

A shared database package for the monorepo monorepo using MikroORM. This package provides database connection management, base entities, and common utilities that can be shared across all applications in the monorepo.

## Features

- 🔌 **Multi-database support**: PostgreSQL, SQLite
- 🏗️ **Base entities** with common fields (id, createdAt, updatedAt)
- 🔄 **Connection management** with singleton pattern
- 🛠️ **Utility functions** for common operations
- 📦 **Repository pattern** with CRUD operations
- 🔀 **Transaction support**
- 📄 **Pagination utilities**
- 🚀 **TypeScript-first** with full type safety

## Installation

This package is already part of the monorepo. To use it in your app:

```json
{
  "dependencies": {
    "@project/database": "workspace:*"
  }
}
```

## Quick Start

### 1. Environment Variables

Set up your environment variables:

```env
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=monorepo
NODE_ENV=development
```

### 2. Initialize Database Connection

```typescript
import {
  initializeDatabase,
  createConfigFromEnv,
  createPostgreSQLConfig,
  createMikroOrmConfigFromEnv,
  Options,
} from "@project/database";

// Method 1: Initialize with environment variables (simplified config)
const orm = await initializeDatabase(createConfigFromEnv());

// Method 2: Use database-specific helpers
const orm = await initializeDatabase(
  createPostgreSQLConfig({
    dbName: "monorepo",
    debug: true,
  })
);

// Method 3: Use full MikroORM configuration directly
const orm = await initializeDatabase(createMikroOrmConfigFromEnv());

// Method 4: Use native MikroORM Options (full control)
const config: Options = {
  driver: PostgreSqlDriver,
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "postgres",
  dbName: "monorepo",
  entities: ["./dist/**/*.entity.js"],
  entitiesTs: ["./src/**/*.entity.ts"],
  debug: true,
};
const orm = await initializeDatabase(config);
```

### 3. Create Entities

```typescript
import { Entity, Property, BaseEntity } from "@project/database";

@Entity()
export class User extends BaseEntity {
  @Property()
  name!: string;

  @Property({ unique: true })
  email!: string;

  @Property({ nullable: true })
  avatar?: string;
}
```

### 4. Use Repository Pattern

```typescript
import { BaseRepository, getEntityManager } from "@project/database";

class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }

  async createUser(userData: { name: string; email: string }): Promise<User> {
    return this.create(userData);
  }
}

// Usage
const userRepo = new UserRepository();
const user = await userRepo.createUser({
  name: "John Doe",
  email: "john@example.com",
});
```

## API Reference

### Configuration

- `createConfigFromEnv()` - Create simplified config from environment variables
- `createMikroOrmConfig(config)` - Convert simplified config to MikroORM Options
- `createMikroOrmConfigFromEnv()` - Create MikroORM Options directly from environment
- `createPostgreSQLConfig(overrides?)` - Create PostgreSQL configuration with defaults

- `createSQLiteConfig(dbPath?, overrides?)` - Create SQLite configuration with defaults

### Connection Management

- `initializeDatabase(config)` - Initialize database connection
- `getDatabase()` - Get database connection instance
- `getEntityManager()` - Get current entity manager
- `createEntityManager()` - Create new entity manager fork

### Base Entities

- `BaseEntity` - Base entity with UUID primary key
- `BaseEntityAutoIncrement` - Base entity with auto-increment primary key

### Utilities

- `BaseRepository<T>` - Generic repository with CRUD operations
- `paginate()` - Pagination utility
- `withTransaction()` - Transaction wrapper
- `bulkCreate()`, `bulkUpdate()`, `bulkDelete()` - Bulk operations

## Usage in Apps

### Express.js API (apps/api)

```typescript
// src/database.ts
import { initializeDatabase, createConfigFromEnv } from "@project/database";

export async function setupDatabase() {
  const orm = await initializeDatabase(createConfigFromEnv());
  return orm;
}

// src/entities/user.entity.ts
import { Entity, Property, BaseEntity } from "@project/database";

@Entity()
export class User extends BaseEntity {
  @Property()
  name!: string;

  @Property({ unique: true })
  email!: string;
}

// src/repositories/user.repository.ts
import { BaseRepository } from "@project/database";
import { User } from "../entities/user.entity.js";

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string) {
    return this.findOne({ email });
  }
}
```

### Astro Web App (apps/web)

```typescript
// src/lib/database.ts
import { getEntityManager } from "@project/database";
import { User } from "./entities/user.entity.js";

export async function getUsers() {
  const em = getEntityManager();
  return em.find(User, {});
}
```

## Migrations

To set up migrations in your app:

1. Copy `mikro-orm.config.ts` to your app root
2. Adjust entity and migration paths
3. Add MikroORM CLI scripts to your app's package.json:

```json
{
  "scripts": {
    "migration:create": "mikro-orm migration:create",
    "migration:up": "mikro-orm migration:up",
    "migration:down": "mikro-orm migration:down",
    "schema:create": "mikro-orm schema:create",
    "schema:update": "mikro-orm schema:update"
  }
}
```

## Supported Databases

- **PostgreSQL** (recommended for production)
- **SQLite** (good for development/testing)

## Best Practices

1. **Use transactions** for operations that modify multiple entities
2. **Fork EntityManager** for request isolation in web applications
3. **Use BaseRepository** for consistent CRUD operations
4. **Leverage pagination** for large datasets
5. **Set up proper indexes** on frequently queried fields
6. **Use migrations** for schema changes in production

## Contributing

When adding new features to this package:

1. Update the exports in `src/index.ts`
2. Add TypeScript types for new functionality
3. Update this README with usage examples
4. Consider backward compatibility
