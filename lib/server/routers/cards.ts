import { getCardById, getCards, getCardsWithProgressionByDeckId } from "@/lib/api/cards/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  cardIdSchema,
  insertCardParams,
  updateCardParams,
} from "@/lib/db/schema/cards";
import { createCard, deleteCard, updateCard } from "@/lib/api/cards/mutations";
import { deckIdSchema } from "@/lib/db/schema/decks";

export const cardsRouter = router({
  getCards: publicProcedure.query(async () => {
    return getCards();
  }),
  getCardsWithProgressionById: publicProcedure.input(deckIdSchema).query(async ({ input }) => {
    return getCardsWithProgressionByDeckId(input.id)
  }),
  getCardById: publicProcedure.input(cardIdSchema).query(async ({ input }) => {
    return getCardById(input.id);
  }),
  createCard: publicProcedure
    .input(insertCardParams)
    .mutation(async ({ input }) => {
      return createCard(input);
    }),
  updateCard: publicProcedure
    .input(updateCardParams)
    .mutation(async ({ input }) => {
      return updateCard(input.id, input);
    }),
  deleteCard: publicProcedure
    .input(cardIdSchema)
    .mutation(async ({ input }) => {
      return deleteCard(input.id);
    }),
});
