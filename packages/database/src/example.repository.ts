import { BaseRepository } from './utils.js';
import { ExampleUser } from './example.entity.js';

/**
 * Example repository demonstrating how to extend BaseRepository
 * This file can be removed in production - it's just for reference
 */
export class ExampleUserRepository extends BaseRepository<ExampleUser> {
  constructor() {
    super(ExampleUser);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<ExampleUser | null> {
    return this.findOne({ email });
  }

  /**
   * Find all active users
   */
  async findActiveUsers(): Promise<ExampleUser[]> {
    return this.find({ isActive: true });
  }

  /**
   * Create a new user
   */
  async createUser(userData: {
    name: string;
    email: string;
    avatar?: string;
  }): Promise<ExampleUser> {
    return this.create(userData);
  }

  /**
   * Update user's last login time
   */
  async updateLastLogin(userId: string): Promise<ExampleUser> {
    return this.update({ id: userId }, { lastLoginAt: new Date() });
  }

  /**
   * Deactivate user
   */
  async deactivateUser(userId: string): Promise<ExampleUser> {
    return this.update({ id: userId }, { isActive: false });
  }

  /**
   * Get users with pagination
   */
  async getUsersPaginated(page: number = 1, limit: number = 10) {
    const repository = this.repository;
    const { paginate } = await import('./utils.js');
    return paginate(repository, {}, { page, limit });
  }
}
