import type { Config } from "drizzle-kit";

export default {
  schema: "./Drizzle/schema.ts",
  out: "./Drizzle/drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: "postgresql://postgres:2006@localhost:5432/drizzle",
  },
} satisfies Config;
