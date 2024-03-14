import { createTRPCRouter } from "~/server/api/trpc";
import { lobbyRouter } from "./routers/lobby";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  lobby: lobbyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
