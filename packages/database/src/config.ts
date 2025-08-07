import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SqliteDriver } from '@mikro-orm/sqlite';

export type DatabaseType = 'postgresql' | 'mysql' | 'sqlite';

export interface DatabaseConfig {
  type: DatabaseType;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  dbName: string;
  debug?: boolean;
  entities?: string[];
  entitiesTs?: string[];
  migrations?: {
    path?: string;
    pathTs?: string;
    glob?: string;
    transactional?: boolean;
    disableForeignKeys?: boolean;
    allOrNothing?: boolean;
    dropTables?: boolean;
    safe?: boolean;
    snapshot?: boolean;
    emit?: 'ts' | 'js';
  };
}

export function createMikroOrmConfig(config: DatabaseConfig): Options {
  const baseConfig: Partial<Options> = {
    debug: config.debug ?? false,
    entities: config.entities ?? ['./dist/**/*.entity.js'],
    entitiesTs: config.entitiesTs ?? ['./src/**/*.entity.ts'],
    migrations: {
      path: './dist/migrations',
      pathTs: './src/migrations',
      glob: '!(*.d).{js,ts}',
      transactional: true,
      disableForeignKeys: false,
      allOrNothing: true,
      dropTables: true,
      safe: false,
      snapshot: true,
      emit: 'ts',
      ...config.migrations,
    },
  };

  switch (config.type) {
    case 'postgresql':
      return {
        ...baseConfig,
        driver: PostgreSqlDriver,
        host: config.host ?? 'localhost',
        port: config.port ?? 5432,
        user: config.user ?? 'postgres',
        password: config.password ?? 'postgres',
        dbName: config.dbName,
      } as Options;

    case 'mysql':
      return {
        ...baseConfig,
        driver: MySqlDriver,
        host: config.host ?? 'localhost',
        port: config.port ?? 3306,
        user: config.user ?? 'root',
        password: config.password ?? '',
        dbName: config.dbName,
      } as Options;

    case 'sqlite':
      return {
        ...baseConfig,
        driver: SqliteDriver,
        dbName: config.dbName, // This should be the path to the SQLite file
      } as Options;

    default:
      throw new Error(`Unsupported database type: ${config.type}`);
  }
}

// Environment-based configuration helpers
export function createConfigFromEnv(): DatabaseConfig {
  const type = (process.env.DB_TYPE as DatabaseType) ?? 'postgresql';

  return {
    type,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME ?? 'grably',
    debug: process.env.NODE_ENV === 'development',
  };
}
