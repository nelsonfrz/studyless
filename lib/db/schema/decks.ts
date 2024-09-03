import { sql } from "drizzle-orm";
import { text, sqliteTable, int, } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getDecks } from "@/lib/api/decks/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const decks = sqliteTable('decks', {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  description: text("description"),
  userId: text("user_id").notNull(),
  public: int("public").default(0).notNull(),

  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

});


// Schema for decks - used to validate API requests
const baseSchema = createSelectSchema(decks).omit(timestamps)

export const insertDeckSchema = createInsertSchema(decks).omit(timestamps);
export const insertDeckParams = baseSchema.extend({}).omit({
  id: true,
  userId: true
});

export const updateDeckSchema = baseSchema;
export const updateDeckParams = baseSchema.extend({}).omit({
  userId: true
});
export const deckIdSchema = baseSchema.pick({ id: true });

// Types for decks - used to type API request params and within Components
export type Deck = typeof decks.$inferSelect;
export type NewDeck = z.infer<typeof insertDeckSchema>;
export type NewDeckParams = z.infer<typeof insertDeckParams>;
export type UpdateDeckParams = z.infer<typeof updateDeckParams>;
export type DeckId = z.infer<typeof deckIdSchema>["id"];

// this type infers the return from getDecks() - meaning it will include any joins
export type CompleteDeck = Awaited<ReturnType<typeof getDecks>>["decks"][number];

