import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findFirst({ columns: { name: true } });
  }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string().trim().min(1).max(20),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUserId = await ctx.db
        .update(users)
        .set({ name: input.name })
        .where(eq(users.id, ctx.session.user.id))
        .returning({ updatedId: users.id });

      if (updatedUserId.length === 0) throw new Error("User not found");
    }),
});
