import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  gameMasterProcedure,
  inLobbyProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  createLobby,
  joinLobby,
  getLobby,
  increasePlayerScore,
  decreasePlayerScore,
  playerBuzzing,
  openLobby,
  closeLobby,
  wrongAnswer,
  correctAnswer,
} from "~/server/game/game";
import pusher from "~/server/pusher/pusher-server";

export const lobbyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        lobbyName: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const lobby = createLobby(ctx.session.user.id, input.lobbyName);

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

  get: inLobbyProcedure.query(async ({ input }) => {
    const lobby = getLobby(input.lobbyId);

    if (!lobby) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Lobby not found",
      });
    }

    return lobby;
  }),

  buzz: inLobbyProcedure.mutation(async ({ ctx, input }) => {
    const playerId = ctx.session.user.id;

    const player = playerBuzzing(input.lobbyId, playerId);

    await pusher.trigger(`private-lobby-${input.lobbyId}`, "buzz", {
      player: player,
    });

    await updateLobby(input.lobbyId);
  }),

  increaseScore: gameMasterProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        points: z.number().int(),
      }),
    )
    .mutation(async ({ input }) => {
      increasePlayerScore(input.lobbyId, input.userId, input.points);

      await updateLobby(input.lobbyId);
    }),

  decreaseScore: gameMasterProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        points: z.number().int(),
      }),
    )
    .mutation(async ({ input }) => {
      decreasePlayerScore(input.lobbyId, input.userId, input.points);

      await updateLobby(input.lobbyId);
    }),

  correctAnswer: gameMasterProcedure.mutation(async ({ input }) => {
    correctAnswer(input.lobbyId);

    await updateLobby(input.lobbyId);
  }),

  wrongAnswer: gameMasterProcedure.mutation(async ({ input }) => {
    wrongAnswer(input.lobbyId);

    await updateLobby(input.lobbyId);
  }),

  changeLobbyState: gameMasterProcedure
    .input(z.object({ open: z.boolean() }))
    .mutation(async ({ input }) => {
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
