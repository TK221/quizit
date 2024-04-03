import { z } from "zod";

import {
  createTRPCRouter,
  gameMasterProcedure,
  inLobbyProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import * as GameMaster from "~/server/game/game-master";
import * as Lobby from "~/server/game/lobby";
import * as Player from "~/server/game/player";
import pusher from "~/server/pusher/pusher-server";

export const lobbyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        lobbyName: z.string().trim().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const lobby = Lobby.createLobby(ctx.session.user.id, input.lobbyName);

      return lobby;
    }),

  join: protectedProcedure
    .input(
      z.object({
        lobbyId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      Lobby.joinLobby(
        input.lobbyId,
        ctx.session.user.id,
        ctx.session.user.name,
      );

      await updateLobby(input.lobbyId);
    }),

  get: inLobbyProcedure.query(async ({ input }) => {
    const lobby = Lobby.getLobby(input.lobbyId);

    return lobby;
  }),

  buzz: inLobbyProcedure.mutation(async ({ ctx, input }) => {
    const playerId = ctx.session.user.id;

    const player = Player.playerBuzzing(input.lobbyId, playerId);

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
      GameMaster.increasePlayerScore(input.lobbyId, input.userId, input.points);

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
      GameMaster.decreasePlayerScore(input.lobbyId, input.userId, input.points);

      await updateLobby(input.lobbyId);
    }),

  correctAnswer: gameMasterProcedure.mutation(async ({ input }) => {
    GameMaster.correctAnswer(input.lobbyId);

    await updateLobby(input.lobbyId);

    await pusher.trigger(`private-lobby-${input.lobbyId}`, "reveal", {
      correct: true,
    });
  }),

  wrongAnswer: gameMasterProcedure.mutation(async ({ input }) => {
    GameMaster.wrongAnswer(input.lobbyId);

    await updateLobby(input.lobbyId);

    await pusher.trigger(`private-lobby-${input.lobbyId}`, "reveal", {
      correct: false,
    });
  }),

  changeLobbyState: gameMasterProcedure
    .input(z.object({ open: z.boolean() }))
    .mutation(async ({ input }) => {
      if (input.open) {
        GameMaster.openLobby(input.lobbyId);
      } else {
        GameMaster.closeLobby(input.lobbyId);
      }

      await updateLobby(input.lobbyId);
    }),
});

async function updateLobby(lobbyId: string) {
  const lobby = Lobby.getLobby(lobbyId);

  await pusher.trigger(`private-lobby-${lobby.id}`, "update", {
    lobby: lobby,
  });
}
