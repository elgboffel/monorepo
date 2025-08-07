import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { SqliteDriver } from "@mikro-orm/sqlite";

export type DatabaseType = "postgresql" | "sqlite";

/**
 * Simplified database configuration type that extends MikroORM's Options
 * but provides convenient defaults and database-specific helpers
 */
export type DatabaseConfig = Partial<Options> & {
  type: DatabaseType;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  dbName: string;
};

/**
 * Create MikroORM configuration from simplified DatabaseConfig
 * This function provides sensible defaults while allowing full customization
 */
export function createMikroOrmConfig(config: DatabaseConfig): Options {
  // Default migration configuration
  const defaultMigrations = {
    path: "./dist/migrations",
    pathTs: "./src/migrations",
    glob: "!(*.d).{js,ts}",
    transactional: true,
    disableForeignKeys: false,
    allOrNothing: true,
    dropTables: true,
    safe: false,
    snapshot: true,
    emit: "ts" as const,
  };

  // Base configuration with defaults
  const baseConfig: Partial<Options> = {
    debug: config.debug ?? false,
    entities: config.entities ?? ["./dist/**/*.entity.js"],
    entitiesTs: config.entitiesTs ?? ["./src/**/*.entity.ts"],
    migrations: {
      ...defaultMigrations,
      ...config.migrations,
    },
    // Allow any other MikroORM options to be passed through
    ...config,
  };

  // Database-specific configuration
  switch (config.type) {
    case "postgresql":
      return {
        ...baseConfig,
        driver: PostgreSqlDriver,
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        dbName: config.dbName,
      } as Options;

    case "sqlite":
      return {
        ...baseConfig,
        driver: SqliteDriver,
        dbName: config.dbName, // This should be the path to the SQLite file
      } as Options;

    default:
      throw new Error(`Unsupported database type: ${config.type}`);
  }
}

/**
 * Create configuration from environment variables
 */
export function createConfigFromEnv(): DatabaseConfig {
  const type = process.env.DB_TYPE as DatabaseType;
  const dbName = process.env.DB_NAME;

  if (!type) {
    throw new Error("DB_TYPE environment variable is required");
  }
  if (!dbName) {
    throw new Error("DB_NAME environment variable is required");
  }

  return {
    type,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dbName,
    debug: process.env.NODE_ENV === "development",
  };
}

/**
 * Create a MikroORM configuration directly from environment variables
 * This is a convenience function that combines createConfigFromEnv() and createMikroOrmConfig()
 */
export function createMikroOrmConfigFromEnv(): Options {
  return createMikroOrmConfig(createConfigFromEnv());
}

/**
 * Helper functions for specific database types using environment variables
 */
export function createPostgreSQLConfig(
  overrides: Partial<DatabaseConfig> = {}
): Options {
  const envConfig = createConfigFromEnv();
  return createMikroOrmConfig({
    ...envConfig,
    type: "postgresql",
    ...overrides,
  });
}

export function createSQLiteConfig(
  overrides: Partial<DatabaseConfig> = {}
): Options {
  const envConfig = createConfigFromEnv();
  return createMikroOrmConfig({
    ...envConfig,
    type: "sqlite",
    ...overrides,
  });
}
