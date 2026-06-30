import { Global, Module } from "@nestjs/common";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { DB } from "./types";

export const KYSELY_DB = "KYSELY_DB";

@Global()
@Module({
  providers: [
    {
      provide: KYSELY_DB,
      useFactory: () => {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
          throw new Error("Missing DATABASE_URL environment variable");
        }

        const pool = new Pool({ connectionString });
        const dialect = new PostgresDialect({ pool });
        return new Kysely<DB>({ dialect });
      },
    },
  ],
  exports: [KYSELY_DB],
})
export class DatabaseModule {}
