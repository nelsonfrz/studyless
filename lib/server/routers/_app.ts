import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { decksRouter } from "./decks";
import { cardsRouter } from "./cards";
import { progressionsRouter } from "./progressions";

export const appRouter = router({
  computers: computersRouter,
  decks: decksRouter,
  cards: cardsRouter,
  progressions: progressionsRouter,
});

export type AppRouter = typeof appRouter;
