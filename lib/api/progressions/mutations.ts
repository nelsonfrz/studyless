import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  ProgressionId, 
  NewProgressionParams,
  UpdateProgressionParams, 
  updateProgressionSchema,
  insertProgressionSchema, 
  progressions,
  progressionIdSchema 
} from "@/lib/db/schema/progressions";
import { getUserAuth } from "@/lib/auth/utils";

export const createProgression = async (progression: NewProgressionParams) => {
  const { session } = await getUserAuth();
  const newProgression = insertProgressionSchema.parse({ ...progression, userId: session?.user.id! });
  try {
    const [p] =  await db.insert(progressions).values(newProgression).returning();
    return { progression: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateProgression = async (id: ProgressionId, progression: UpdateProgressionParams) => {
  const { session } = await getUserAuth();
  const { id: progressionId } = progressionIdSchema.parse({ id });
  const newProgression = updateProgressionSchema.parse({ ...progression, userId: session?.user.id! });
  try {
    const [p] =  await db
     .update(progressions)
     .set({...newProgression, updatedAt: new Date().toISOString().slice(0, 19).replace("T", " ") })
     .where(and(eq(progressions.id, progressionId!), eq(progressions.userId, session?.user.id!)))
     .returning();
    return { progression: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteProgression = async (id: ProgressionId) => {
  const { session } = await getUserAuth();
  const { id: progressionId } = progressionIdSchema.parse({ id });
  try {
    const [p] =  await db.delete(progressions).where(and(eq(progressions.id, progressionId!), eq(progressions.userId, session?.user.id!)))
    .returning();
    return { progression: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

