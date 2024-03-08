import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:2006@localhost:5432/drizzle",
});

async function migrator() {
  const db = drizzle(pool);
  console.log("Migrating");

  await migrate(db, { migrationsFolder: "Drizzle/drizzle" });
  console.log("Migrated successfully");
  process.exit(0);
}
migrator().catch((err) => {
  console.log("An error in migrating: ", err);
  process.exit(1);
});
