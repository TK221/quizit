import { createTRPCRouter } from "~/server/api/trpc";
import { lobbyRouter } from "./routers/lobby";
import { userRouter } from "./routers/user";
import { profileRouter } from "./routers/profile";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  lobby: lobbyRouter,
  user: userRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
