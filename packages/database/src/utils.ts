import {
  EntityManager,
  EntityRepository,
  AnyEntity,
  FilterQuery,
  FindOptions,
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

  async findAll(options?: any): Promise<T[]> {
    return this.repository.findAll(options as any) as Promise<T[]>;
  }

  async findOne(where: FilterQuery<T>, options?: any): Promise<T | null> {
    return this.repository.findOne(where, options as any) as Promise<T | null>;
  }

  async findOneOrFail(where: FilterQuery<T>, options?: any): Promise<T> {
    return this.repository.findOneOrFail(where, options as any) as Promise<T>;
  }

  async find(where: FilterQuery<T>, options?: any): Promise<T[]> {
    return this.repository.find(where, options as any) as Promise<T[]>;
  }

  async create(data: any): Promise<T> {
    const entity = this.repository.create(data);
    await this.em.persistAndFlush(entity);
    return entity;
  }

  async update(where: FilterQuery<T>, data: any): Promise<T> {
    const entity = await this.findOneOrFail(where);
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
}

/**
 * Pagination utilities
 */
export type PaginationOptions = {
  page?: number;
  limit?: number;
  offset?: number;
};

export type PaginatedResult<T> = {
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
  options: PaginationOptions & FindOptions<T> = {}
): Promise<PaginatedResult<T>> {
  const { page = 1, limit = 10, offset, ...findOptions } = options;

  const actualOffset = offset ?? (page - 1) * limit;

  const [data, total] = await repository.findAndCount(where, {
    ...findOptions,
    limit,
    offset: actualOffset,
  } as any);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data as T[],
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
  data: any[],
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
  data: any,
  em?: EntityManager
): Promise<number> {
  const entityManager = em ?? getDatabase().getEntityManager();
  const repository = entityManager.getRepository(entityClass);

  return repository.nativeUpdate(where, data);
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
