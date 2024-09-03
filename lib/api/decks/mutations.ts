import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  DeckId, 
  NewDeckParams,
  UpdateDeckParams, 
  updateDeckSchema,
  insertDeckSchema, 
  decks,
  deckIdSchema 
} from "@/lib/db/schema/decks";
import { getUserAuth } from "@/lib/auth/utils";

export const createDeck = async (deck: NewDeckParams) => {
  const { session } = await getUserAuth();
  const newDeck = insertDeckSchema.parse({ ...deck, userId: session?.user.id! });
  try {
    const [d] =  await db.insert(decks).values(newDeck).returning();
    return { deck: d };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateDeck = async (id: DeckId, deck: UpdateDeckParams) => {
  const { session } = await getUserAuth();
  const { id: deckId } = deckIdSchema.parse({ id });
  const newDeck = updateDeckSchema.parse({ ...deck, userId: session?.user.id! });
  try {
    const [d] =  await db
     .update(decks)
     .set({...newDeck, updatedAt: new Date().toISOString().slice(0, 19).replace("T", " ") })
     .where(and(eq(decks.id, deckId!), eq(decks.userId, session?.user.id!)))
     .returning();
    return { deck: d };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteDeck = async (id: DeckId) => {
  const { session } = await getUserAuth();
  const { id: deckId } = deckIdSchema.parse({ id });
  try {
    const [d] =  await db.delete(decks).where(and(eq(decks.id, deckId!), eq(decks.userId, session?.user.id!)))
    .returning();
    return { deck: d };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

