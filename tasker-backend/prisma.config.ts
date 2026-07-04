// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";
import path from "node:path";

export default defineConfig({
  schema: path.join("prisma", "schema"),
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
