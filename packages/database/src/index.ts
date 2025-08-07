// Configuration
export {
  type DatabaseConfig,
  type DatabaseType,
  createMikroOrmConfig,
  createConfigFromEnv,
} from './config.js';

// Connection management
export {
  DatabaseConnection,
  initializeDatabase,
  getDatabase,
  getEntityManager,
  createEntityManager,
} from './connection.js';

// Base entities
export { BaseEntity, BaseEntityAutoIncrement } from './base-entity.js';

// Utilities
export {
  BaseRepository,
  type PaginationOptions,
  type PaginatedResult,
  paginate,
  withTransaction,
  bulkCreate,
  bulkUpdate,
  bulkDelete,
} from './utils.js';

// Examples (remove in production)
export { ExampleUser } from './example.entity.js';
export { ExampleUserRepository } from './example.repository.js';

// Re-export commonly used MikroORM types and decorators
export {
  Entity,
  Property,
  PrimaryKey,
  ManyToOne,
  OneToMany,
  ManyToMany,
  OneToOne,
  Enum,
  Index,
  Unique,
  Collection,
  Reference,
  Cascade,
  LoadStrategy,
  type EntityManager,
  type EntityRepository,
  type FilterQuery,
  type FindOptions,
  type Populate,
  type AnyEntity,
  type Primary,
  type Ref,
  wrap,
} from '@mikro-orm/core';
