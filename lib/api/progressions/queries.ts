import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type ProgressionId, progressionIdSchema, progressions } from "@/lib/db/schema/progressions";
import { cards } from "@/lib/db/schema/cards";

export const getProgressions = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select({ progression: progressions, card: cards }).from(progressions).leftJoin(cards, eq(progressions.cardId, cards.id)).where(eq(progressions.userId, session?.user.id!));
  const p = rows .map((r) => ({ ...r.progression, card: r.card})); 
  return { progressions: p };
};

export const getProgressionById = async (id: ProgressionId) => {
  const { session } = await getUserAuth();
  const { id: progressionId } = progressionIdSchema.parse({ id });
  const [row] = await db.select({ progression: progressions, card: cards }).from(progressions).where(and(eq(progressions.id, progressionId), eq(progressions.userId, session?.user.id!))).leftJoin(cards, eq(progressions.cardId, cards.id));
  if (row === undefined) return {};
  const p =  { ...row.progression, card: row.card } ;
  return { progression: p };
};


