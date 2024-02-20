import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import pusher from "~/server/pusher/pusher-server";

export const lobbyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx }) => {
      pusher
        .trigger("private-lobby-cool", "trigger", {
          message: ctx.session.user.id + " created a lobby",
        })
        .then(() => {
          console.log("server triggered");
        })
        .catch((err) => {
          console.log(err);
        });
    }),
});
