import { Options } from "@mikro-orm/core";
import { createConfigFromEnv, createMikroOrmConfig } from "./config.js";

/**
 * Default MikroORM configuration for CLI usage
 * This file is used by MikroORM CLI commands like migrations
 *
 * To use this in your project:
 * 1. Copy this file to your project root
 * 2. Adjust the entities and migrations paths
 * 3. Set up your environment variables
 */
const config: Options = createMikroOrmConfig({
  ...createConfigFromEnv(),
  // Override paths for your specific project
  entities: ["./dist/**/*.entity.js"],
  entitiesTs: ["./src/**/*.entity.ts"],
  migrations: {
    path: "./dist/migrations",
    pathTs: "./src/migrations",
    glob: "!(*.d).{js,ts}",
    transactional: true,
    disableForeignKeys: false,
    allOrNothing: true,
    dropTables: true,
    safe: false,
    snapshot: true,
    emit: "ts",
  },
});

export default config;
