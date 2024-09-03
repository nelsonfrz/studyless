import { getDeckById, getDecks } from "@/lib/api/decks/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  deckIdSchema,
  insertDeckParams,
  updateDeckParams,
} from "@/lib/db/schema/decks";
import { createDeck, deleteDeck, updateDeck } from "@/lib/api/decks/mutations";

export const decksRouter = router({
  getDecks: publicProcedure.query(async () => {
    return getDecks();
  }),
  getDeckById: publicProcedure.input(deckIdSchema).query(async ({ input }) => {
    return getDeckById(input.id);
  }),
  createDeck: publicProcedure
    .input(insertDeckParams)
    .mutation(async ({ input }) => {
      return createDeck(input);
    }),
  updateDeck: publicProcedure
    .input(updateDeckParams)
    .mutation(async ({ input }) => {
      return updateDeck(input.id, input);
    }),
  deleteDeck: publicProcedure
    .input(deckIdSchema)
    .mutation(async ({ input }) => {
      return deleteDeck(input.id);
    }),
});
