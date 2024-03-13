import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  type Lobby,
  createLobby,
  joinLobby,
  getLobby,
} from "~/server/game/game";
import pusher from "~/server/pusher/pusher-server";

export const lobbyRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const lobby = createLobby(ctx.session.user.id);

    if (!lobby) {
      throw new Error("Failed to create lobby");
    }

    return lobby;
  }),

  join: protectedProcedure
    .input(
      z.object({ lobbyId: z.string().min(1), username: z.string().min(1) }),
    )
    .mutation(async ({ ctx, input }) => {
      const lobby = joinLobby(
        input.lobbyId,
        ctx.session.user.id,
        input.username,
      );

      if (!lobby) {
        throw new Error("Failed to join lobby");
      }

      await updateLobby(lobby);

      return lobby;
    }),

  get: protectedProcedure
    .input(z.object({ lobbyId: z.string().min(1) }))
    .query(async ({ input }) => {
      const lobby = getLobby(input.lobbyId);

      if (!lobby) {
        throw new Error("Lobby not found");
      }

      return lobby;
    }),

  trigger: protectedProcedure
    .input(z.object({ lobbyId: z.string().min(1) }))
    .mutation(async ({ input }) => {
      await pusher.trigger(`private-lobby-${input.lobbyId}`, "trigger", {
        lobbyId: input.lobbyId,
      });
    }),
});

async function updateLobby(lobby: Lobby) {
  await pusher.trigger(`private-lobby-${lobby.id}`, "update", {
    lobby: lobby,
  });
}
