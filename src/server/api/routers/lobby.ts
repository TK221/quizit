import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  createLobby,
  joinLobby,
  getLobby,
  increasePlayerScore,
  decreasePlayerScore,
  isPlayerGameMaster,
  playerBuzzing,
  openLobby,
  closeLobby,
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
      joinLobby(input.lobbyId, ctx.session.user.id, input.username);

      await updateLobby(input.lobbyId);
    }),

  get: protectedProcedure
    .input(z.object({ lobbyId: z.string().min(1) }))
    .query(async ({ input }) => {
      const lobby = getLobby(input.lobbyId);

      if (!lobby) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lobby not found",
        });
      }

      return lobby;
    }),

  increaseScore: protectedProcedure
    .input(
      z.object({
        lobbyId: z.string().min(1),
        userId: z.string().min(1),
        points: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const res = isPlayerGameMaster(input.lobbyId, ctx.session.user.id);

      if (!res) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not the game master",
        });
      }

      increasePlayerScore(input.lobbyId, input.userId, input.points);

      await updateLobby(input.lobbyId);
    }),

  decreaseScore: protectedProcedure
    .input(
      z.object({
        lobbyId: z.string().min(1),
        userId: z.string().min(1),
        points: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const res = isPlayerGameMaster(input.lobbyId, ctx.session.user.id);

      if (!res) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not the game master",
        });
      }

      decreasePlayerScore(input.lobbyId, input.userId, input.points);

      await updateLobby(input.lobbyId);
    }),

  buzz: protectedProcedure
    .input(z.object({ lobbyId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const playerId = ctx.session.user.id;

      const player = playerBuzzing(input.lobbyId, playerId);

      await pusher.trigger(`private-lobby-${input.lobbyId}`, "buzz", {
        player: player,
      });

      await updateLobby(input.lobbyId);
    }),

  changeLobbyState: protectedProcedure
    .input(z.object({ lobbyId: z.string().min(1), open: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const res = isPlayerGameMaster(input.lobbyId, ctx.session.user.id);

      if (!res) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not the game master",
        });
      }

      if (input.open) {
        openLobby(input.lobbyId);
      } else {
        closeLobby(input.lobbyId);
      }

      await updateLobby(input.lobbyId);
    }),
});

async function updateLobby(lobbyId: string) {
  const lobby = getLobby(lobbyId);

  if (!lobby) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Lobby not found",
    });
  }

  await pusher.trigger(`private-lobby-${lobby.id}`, "update", {
    lobby: lobby,
  });
}
