import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { cards } from "./cards"
import { type getProgressions } from "@/lib/api/progressions/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const progressions = sqliteTable('progressions', {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  cardId: text("card_id").references(() => cards.id, { onDelete: "cascade" }).notNull(),
  progress: integer("progress").notNull(),
  userId: text("user_id").notNull(),
  
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

});


// Schema for progressions - used to validate API requests
const baseSchema = createSelectSchema(progressions).omit(timestamps)

export const insertProgressionSchema = createInsertSchema(progressions).omit(timestamps);
export const insertProgressionParams = baseSchema.extend({
  cardId: z.coerce.string().min(1),
  progress: z.coerce.number()
}).omit({ 
  id: true,
  userId: true
});

export const updateProgressionSchema = baseSchema;
export const updateProgressionParams = baseSchema.extend({
  cardId: z.coerce.string().min(1),
  progress: z.coerce.number()
}).omit({ 
  userId: true
});
export const progressionIdSchema = baseSchema.pick({ id: true });

// Types for progressions - used to type API request params and within Components
export type Progression = typeof progressions.$inferSelect;
export type NewProgression = z.infer<typeof insertProgressionSchema>;
export type NewProgressionParams = z.infer<typeof insertProgressionParams>;
export type UpdateProgressionParams = z.infer<typeof updateProgressionParams>;
export type ProgressionId = z.infer<typeof progressionIdSchema>["id"];
    
// this type infers the return from getProgressions() - meaning it will include any joins
export type CompleteProgression = Awaited<ReturnType<typeof getProgressions>>["progressions"][number];

