import { MikroORM, EntityManager, RequestContext } from '@mikro-orm/core';
import { createMikroOrmConfig, DatabaseConfig } from './config.js';

export class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private orm: MikroORM | null = null;
  private config: DatabaseConfig;

  private constructor(config: DatabaseConfig) {
    this.config = config;
  }

  /**
   * Get or create a singleton instance of DatabaseConnection
   */
  static getInstance(config?: DatabaseConfig): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      if (!config) {
        throw new Error(
          'DatabaseConnection config is required for first initialization'
        );
      }
      DatabaseConnection.instance = new DatabaseConnection(config);
    }
    return DatabaseConnection.instance;
  }

  /**
   * Initialize the database connection
   */
  async connect(): Promise<MikroORM> {
    if (this.orm) {
      return this.orm;
    }

    try {
      const mikroOrmConfig = createMikroOrmConfig(this.config);
      this.orm = await MikroORM.init(mikroOrmConfig);

      console.log(
        `✅ Connected to ${this.config.type} database: ${this.config.dbName}`
      );
      return this.orm;
    } catch (error) {
      console.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }

  /**
   * Get the MikroORM instance
   */
  getORM(): MikroORM {
    if (!this.orm) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.orm;
  }

  /**
   * Get the EntityManager
   */
  getEntityManager(): EntityManager {
    return this.getORM().em;
  }

  /**
   * Create a new EntityManager fork for request isolation
   */
  createEntityManager(): EntityManager {
    return this.getORM().em.fork();
  }

  /**
   * Run code within a request context (useful for request isolation)
   */
  async runInContext<T>(
    callback: (em: EntityManager) => Promise<T>
  ): Promise<T> {
    const em = this.createEntityManager();
    return RequestContext.create(em, callback);
  }

  /**
   * Run code within a database transaction
   */
  async runInTransaction<T>(
    callback: (em: EntityManager) => Promise<T>
  ): Promise<T> {
    const em = this.createEntityManager();
    return em.transactional(callback);
  }

  /**
   * Close the database connection
   */
  async disconnect(): Promise<void> {
    if (this.orm) {
      await this.orm.close();
      this.orm = null;
      console.log('🔌 Database connection closed');
    }
  }

  /**
   * Check if the database is connected
   */
  async isConnected(): Promise<boolean> {
    if (!this.orm) return false;
    return this.orm.isConnected();
  }

  /**
   * Get database schema generator (for migrations and schema management)
   */
  getSchemaGenerator() {
    return this.getORM().getSchemaGenerator();
  }

  /**
   * Get migrator instance
   */
  getMigrator() {
    return this.getORM().getMigrator();
  }
}

// Convenience functions for common operations
export async function initializeDatabase(
  config: DatabaseConfig
): Promise<MikroORM> {
  const connection = DatabaseConnection.getInstance(config);
  return connection.connect();
}

export function getDatabase(): DatabaseConnection {
  return DatabaseConnection.getInstance();
}

export function getEntityManager(): EntityManager {
  return getDatabase().getEntityManager();
}

export function createEntityManager(): EntityManager {
  return getDatabase().createEntityManager();
}
