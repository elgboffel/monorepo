import {
  EntityManager,
  EntityRepository,
  AnyEntity,
  FilterQuery,
  FindOptions,
  EntityData,
  RequiredEntityData,
  FindOneOptions,
  FindOneOrFailOptions,
  FindAllOptions,
} from "@mikro-orm/core";
import { getDatabase } from "./connection.js";

/**
 * Generic repository wrapper with common CRUD operations
 */
export class BaseRepository<T extends AnyEntity> {
  protected em: EntityManager;
  protected repository: EntityRepository<T>;

  constructor(entityClass: new () => T, em?: EntityManager) {
    this.em = em ?? getDatabase().getEntityManager();
    this.repository = this.em.getRepository(entityClass);
  }

  async findAll(options?: FindAllOptions<T>): Promise<T[]> {
    return this.repository.findAll(options);
  }

  async findOne(
    where: FilterQuery<T>,
    options?: FindOneOptions<T>
  ): Promise<T | null> {
    return this.repository.findOne(where, options);
  }

  async findOneOrFail(
    where: FilterQuery<T>,
    options?: FindOneOrFailOptions<T>
  ): Promise<T> {
    return this.repository.findOneOrFail(where, options);
  }

  async find(where: FilterQuery<T>, options?: FindOptions<T>): Promise<T[]> {
    return this.repository.find(where, options);
  }

  async create(data: RequiredEntityData<T>): Promise<T> {
    const entity = this.repository.create(data);
    await this.em.persistAndFlush(entity);
    return entity;
  }

  async update(where: FilterQuery<T>, data: Partial<T>): Promise<T> {
    const entity = await this.findOneOrFail(where);
    // Using any here due to MikroORM's extremely complex assign type constraints
    // This is the only place where any is necessary for this method
    this.repository.assign(entity, data as any);
    await this.em.flush();
    return entity;
  }

  async delete(where: FilterQuery<T>): Promise<number> {
    return this.repository.nativeDelete(where);
  }

  async count(where?: FilterQuery<T>): Promise<number> {
    return this.repository.count(where);
  }

  async exists(where: FilterQuery<T>): Promise<boolean> {
    const count = await this.count(where);
    return count > 0;
  }

  /**
   * Find entities with pagination
   */
  async findWithPagination(
    where: FilterQuery<T> = {},
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<T>> {
    return paginate(this.repository, where, options);
  }

  /**
   * Create multiple entities at once
   */
  async createMany(data: RequiredEntityData<T>[]): Promise<T[]> {
    const entities = data.map(item => this.repository.create(item));
    await this.em.persistAndFlush(entities);
    return entities;
  }

  /**
   * Update multiple entities by their IDs
   */
  async updateMany(ids: (string | number)[], data: Partial<T>): Promise<T[]> {
    const entities = await this.repository.find({
      id: { $in: ids },
    } as FilterQuery<T>);
    // Using any here due to MikroORM's extremely complex assign type constraints
    entities.forEach(entity => this.repository.assign(entity, data as any));
    await this.em.flush();
    return entities;
  }

  /**
   * Soft delete (if entity has deletedAt field)
   */
  async softDelete(where: FilterQuery<T>): Promise<number> {
    // Using any here as deletedAt may not exist on all entities
    return this.repository.nativeUpdate(where, {
      deletedAt: new Date(),
    } as any);
  }

  /**
   * Get the underlying repository for advanced operations
   */
  getRepository(): EntityRepository<T> {
    return this.repository;
  }

  /**
   * Get the entity manager for transaction operations
   */
  getEntityManager(): EntityManager {
    return this.em;
  }
}

/**
 * Pagination utilities
 */
export type PaginationOptions = {
  page?: number;
  limit?: number;
  offset?: number;
};

export type PaginatedResult<T extends AnyEntity> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export async function paginate<T extends AnyEntity>(
  repository: EntityRepository<T>,
  where: FilterQuery<T> = {},
  options: PaginationOptions = {}
): Promise<PaginatedResult<T>> {
  const { page = 1, limit = 10, offset } = options;

  const actualOffset = offset ?? (page - 1) * limit;

  const [data, total] = await repository.findAndCount(where, {
    limit,
    offset: actualOffset,
  });

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Transaction utilities
 */
export async function withTransaction<T>(
  callback: (em: EntityManager) => Promise<T>,
  em?: EntityManager
): Promise<T> {
  const entityManager = em ?? getDatabase().createEntityManager();
  return entityManager.transactional(callback);
}

/**
 * Bulk operations utilities
 */
export async function bulkCreate<T extends AnyEntity>(
  entityClass: new () => T,
  data: RequiredEntityData<T>[],
  em?: EntityManager
): Promise<T[]> {
  const entityManager = em ?? getDatabase().getEntityManager();
  const repository = entityManager.getRepository(entityClass);

  const entities = data.map(item => repository.create(item));
  await entityManager.persistAndFlush(entities);

  return entities;
}

export async function bulkUpdate<T extends AnyEntity>(
  entityClass: new () => T,
  where: FilterQuery<T>,
  data: Partial<T>,
  em?: EntityManager
): Promise<number> {
  const entityManager = em ?? getDatabase().getEntityManager();
  const repository = entityManager.getRepository(entityClass);

  // Using any here due to MikroORM's extremely complex nativeUpdate type constraints
  return repository.nativeUpdate(where, data as any);
}

export async function bulkDelete<T extends AnyEntity>(
  entityClass: new () => T,
  where: FilterQuery<T>,
  em?: EntityManager
): Promise<number> {
  const entityManager = em ?? getDatabase().getEntityManager();
  const repository = entityManager.getRepository(entityClass);

  return repository.nativeDelete(where);
}
