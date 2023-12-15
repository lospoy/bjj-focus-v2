import { createTRPCRouter } from "~/server/api/trpc";
import { jitsRouter } from "./routers/jits";
import { usersRouter } from "./routers/users";
import { sessionsRouter } from "./routers/sessions";
import { notesRouter } from "./routers/notes";
import { categoriesRouter } from "./routers/categories";
import { positionsRouter } from "./routers/positions";
import { movesRouter } from "./routers/moves";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  jits: jitsRouter,
  users: usersRouter,
  sessions: sessionsRouter,
  notes: notesRouter,
  categories: categoriesRouter,
  positions: positionsRouter,
  moves: movesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
