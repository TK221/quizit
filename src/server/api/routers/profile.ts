import { profiles } from "~/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { desc } from "drizzle-orm";

export const profileRouter = createTRPCRouter({
  getTopProfiles: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.profiles.findMany({
      orderBy: [desc(profiles.gamesWon)],
      limit: 10,
      with: {
        user: {
          columns: {
            name: true,
          },
        },
      },
    });
  }),
});
