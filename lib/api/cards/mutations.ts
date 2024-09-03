import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  CardId, 
  NewCardParams,
  UpdateCardParams, 
  updateCardSchema,
  insertCardSchema, 
  cards,
  cardIdSchema 
} from "@/lib/db/schema/cards";

export const createCard = async (card: NewCardParams) => {
  const newCard = insertCardSchema.parse(card);
  try {
    const [c] =  await db.insert(cards).values(newCard).returning();
    return { card: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateCard = async (id: CardId, card: UpdateCardParams) => {
  const { id: cardId } = cardIdSchema.parse({ id });
  const newCard = updateCardSchema.parse(card);
  try {
    const [c] =  await db
     .update(cards)
     .set({...newCard, updatedAt: new Date().toISOString().slice(0, 19).replace("T", " ") })
     .where(eq(cards.id, cardId!))
     .returning();
    return { card: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteCard = async (id: CardId) => {
  const { id: cardId } = cardIdSchema.parse({ id });
  try {
    const [c] =  await db.delete(cards).where(eq(cards.id, cardId!))
    .returning();
    return { card: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

