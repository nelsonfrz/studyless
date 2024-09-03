import { getProgressionById, getProgressions } from "@/lib/api/progressions/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  progressionIdSchema,
  insertProgressionParams,
  updateProgressionParams,
} from "@/lib/db/schema/progressions";
import { createProgression, deleteProgression, updateProgression } from "@/lib/api/progressions/mutations";

export const progressionsRouter = router({
  getProgressions: publicProcedure.query(async () => {
    return getProgressions();
  }),
  getProgressionById: publicProcedure.input(progressionIdSchema).query(async ({ input }) => {
    return getProgressionById(input.id);
  }),
  createProgression: publicProcedure
    .input(insertProgressionParams)
    .mutation(async ({ input }) => {
      return createProgression(input);
    }),
  updateProgression: publicProcedure
    .input(updateProgressionParams)
    .mutation(async ({ input }) => {
      return updateProgression(input.id, input);
    }),
  deleteProgression: publicProcedure
    .input(progressionIdSchema)
    .mutation(async ({ input }) => {
      return deleteProgression(input.id);
    }),
});
