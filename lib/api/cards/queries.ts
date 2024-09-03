import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type CardId, cardIdSchema, cards } from "@/lib/db/schema/cards";
import { DeckId, deckIdSchema, decks } from "@/lib/db/schema/decks";
import { progressions } from "@/lib/db/schema/progressions";
import { CardWithProgression } from "@/lib/types";

export const getCards = async () => {
  const rows = await db.select({ card: cards, deck: decks }).from(cards).leftJoin(decks, eq(cards.deckId, decks.id));
  const c = rows.map((r) => ({ ...r.card, deck: r.deck }));
  return { cards: c };
};

export const getCardById = async (id: CardId) => {
  const { id: cardId } = cardIdSchema.parse({ id });
  const [row] = await db.select({ card: cards, deck: decks }).from(cards).where(eq(cards.id, cardId)).leftJoin(decks, eq(cards.deckId, decks.id));
  if (row === undefined) return {};
  const c = { ...row.card, deck: row.deck };
  return { card: c };
};

export const getCardsWithProgressionByDeckId = async (id: DeckId): Promise<CardWithProgression[]> => {
  const { id: deckId } = deckIdSchema.parse({ id });
  return await db
    .select({ front: cards.front, back: cards.back, progress: progressions.progress, cardId: cards.id, progressionId: progressions.id })
    .from(cards)
    .where(eq(cards.deckId, deckId))
    .leftJoin(progressions, eq(cards.id, progressions.cardId))
    .orderBy(progressions.progress)
}