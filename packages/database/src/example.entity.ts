import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base-entity.js';

/**
 * Example entity demonstrating how to use the database package
 * This file can be removed in production - it's just for reference
 */
@Entity()
export class ExampleUser extends BaseEntity {
  @Property()
  name!: string;

  @Property({ unique: true })
  email!: string;

  @Property({ nullable: true })
  avatar?: string;

  @Property({ default: true })
  isActive: boolean = true;

  @Property({ nullable: true })
  lastLoginAt?: Date;
}
