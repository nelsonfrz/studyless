import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type DeckId, deckIdSchema, decks } from "@/lib/db/schema/decks";

export const getDecks = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select().from(decks).where(eq(decks.userId, session?.user.id!));
  const d = rows
  return { decks: d };
};

export const getDeckById = async (id: DeckId) => {
  const { session } = await getUserAuth();
  const { id: deckId } = deckIdSchema.parse({ id });
  const [row] = await db.select().from(decks).where(and(eq(decks.id, deckId), eq(decks.userId, session?.user.id!)));
  if (row === undefined) return {};
  const d = row;
  return { deck: d };
};
