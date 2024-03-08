import { sql } from "drizzle-orm";
import { integer, pgTable, serial, uuid, varchar } from "drizzle-orm/pg-core";

export const owner = pgTable("owner", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").unique().notNull(),
});

export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 20 }).notNull(),
  ownerId: integer("ownerId")
    .references(() => owner.id)
    .notNull(),
});
