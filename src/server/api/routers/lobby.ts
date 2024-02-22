import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createLobby, joinLobby } from "~/server/game/game";
import pusher from "~/server/pusher/pusher-server";

export const lobbyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ username: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const lobby = createLobby(ctx.session.user.id, input.username);

      if (!lobby) {
        throw new Error("Failed to create lobby");
      }

      const result = await pusher.trigger("private-lobby-cool", "trigger", {
        message: ctx.session.user.id + " created a lobby",
      });

      if (!result.ok) {
        throw new Error("Failed to trigger event");
      }

      return lobby;
    }),

  join: protectedProcedure
    .input(
      z.object({ lobby_id: z.string().min(1), username: z.string().min(1) }),
    )
    .mutation(async ({ ctx, input }) => {
      const lobby = joinLobby(
        input.lobby_id,
        ctx.session.user.id,
        input.username,
      );

      if (!lobby) {
        throw new Error("Failed to join lobby");
      }

      return lobby;
    }),
});
