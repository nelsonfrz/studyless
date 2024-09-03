import { sql } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { decks } from "./decks"
import { type getCards } from "@/lib/api/cards/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const cards = sqliteTable('cards', {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  front: text("front").notNull(),
  back: text("back").notNull(),
  deckId: text("deck_id").references(() => decks.id, { onDelete: "cascade" }).notNull(),
  
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

});


// Schema for cards - used to validate API requests
const baseSchema = createSelectSchema(cards).omit(timestamps)

export const insertCardSchema = createInsertSchema(cards).omit(timestamps);
export const insertCardParams = baseSchema.extend({
  deckId: z.coerce.string().min(1)
}).omit({ 
  id: true
});

export const updateCardSchema = baseSchema;
export const updateCardParams = baseSchema.extend({
  deckId: z.coerce.string().min(1)
})
export const cardIdSchema = baseSchema.pick({ id: true });

// Types for cards - used to type API request params and within Components
export type Card = typeof cards.$inferSelect;
export type NewCard = z.infer<typeof insertCardSchema>;
export type NewCardParams = z.infer<typeof insertCardParams>;
export type UpdateCardParams = z.infer<typeof updateCardParams>;
export type CardId = z.infer<typeof cardIdSchema>["id"];
    
// this type infers the return from getCards() - meaning it will include any joins
export type CompleteCard = Awaited<ReturnType<typeof getCards>>["cards"][number];

