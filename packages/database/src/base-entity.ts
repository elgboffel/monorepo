import {
  PrimaryKey,
  Property,
  BaseEntity as MikroBaseEntity,
  BeforeCreate,
  BeforeUpdate,
} from '@mikro-orm/core';

export abstract class BaseEntity extends MikroBaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property({ type: 'timestamptz', defaultRaw: 'now()' })
  createdAt!: Date;

  @Property({
    type: 'timestamptz',
    defaultRaw: 'now()',
    onUpdate: () => new Date(),
  })
  updatedAt!: Date;

  @BeforeCreate()
  beforeCreate() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = new Date();
  }
}

// Alternative base entity for auto-increment IDs
export abstract class BaseEntityAutoIncrement extends MikroBaseEntity {
  @PrimaryKey({ type: 'int', autoincrement: true })
  id!: number;

  @Property({ type: 'timestamptz', defaultRaw: 'now()' })
  createdAt!: Date;

  @Property({
    type: 'timestamptz',
    defaultRaw: 'now()',
    onUpdate: () => new Date(),
  })
  updatedAt!: Date;

  @BeforeCreate()
  beforeCreate() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = new Date();
  }
}
