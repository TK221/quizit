import { TRPCError } from "@trpc/server";
import * as Lobby from "./lobby";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { profiles } from "../db/schema";

export function openLobby(lobbyId: string): void {
  const lobby = Lobby.getLobby(lobbyId);

  lobby.open = true;
  Lobby.resetBuzzingPlayer(lobbyId);
}

export function closeLobby(lobbyId: string): void {
  const lobby = Lobby.getLobby(lobbyId);

  lobby.open = false;
}

export function increasePlayerScore(
  lobbyId: string,
  playerId: string,
  points: number,
): void {
  const player = Lobby.getPlayer(lobbyId, playerId);

  player.score += points;
}

export function decreasePlayerScore(
  lobbyId: string,
  playerId: string,
  points: number,
): void {
  const player = Lobby.getPlayer(lobbyId, playerId);

  const newScore = player.score - points;

  if (newScore < 0) {
    player.score = 0;
  } else {
    player.score = newScore;
  }
}

export function correctAnswer(lobbyId: string): void {
  const buzzingPlayer = Lobby.getBuzzingPlayer(lobbyId);
  if (!buzzingPlayer)
    throw new TRPCError({ code: "NOT_FOUND", message: "No player buzzing" });

  increasePlayerScore(lobbyId, buzzingPlayer.userId, 3);
  buzzingPlayer.correctAnswers += 1;
  nextQuestion(lobbyId);

  Lobby.resetBuzzingPlayer(lobbyId);
}

export function wrongAnswer(lobbyId: string): void {
  const buzzingPlayer = Lobby.getBuzzingPlayer(lobbyId);
  if (!buzzingPlayer)
    throw new TRPCError({ code: "NOT_FOUND", message: "No player buzzing" });

  buzzingPlayer.wrongAnswers += 1;

  const players = Lobby.getPlayers(lobbyId);

  // Increase score for all players except the one who buzzed
  players.forEach((player) => {
    if (player.userId !== buzzingPlayer.userId)
      increasePlayerScore(lobbyId, player.userId, 1);
  });

  Lobby.resetBuzzingPlayer(lobbyId);
}

export function nextQuestion(lobbyId: string): void {
  const lobby = Lobby.getLobby(lobbyId);

  lobby.currentQuestion += 1;
}

export function previousQuestion(lobbyId: string): void {
  const lobby = Lobby.getLobby(lobbyId);

  if (lobby.currentQuestion > 0) {
    lobby.currentQuestion -= 1;
  }
}

export async function endGame(lobbyId: string): Promise<void> {
  const players = Lobby.getPlayers(lobbyId);

  const winnerPlayerId = Lobby.getPlayerWithHighestScore(lobbyId)?.userId;

  if (!winnerPlayerId) return Lobby.deleteLobby(lobbyId);

  for (const player of players) {
    const playerProfile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, player.userId),
    });

    if (playerProfile) {
      await db
        .update(profiles)
        .set({
          gamesPlayed: playerProfile.gamesPlayed + 1,
          gamesWon:
            playerProfile.gamesWon + (player.userId === winnerPlayerId ? 1 : 0),
          correctAnswers: playerProfile.correctAnswers + player.correctAnswers,
          wrongAnswers: playerProfile.wrongAnswers + player.wrongAnswers,
        })
        .where(eq(profiles.userId, player.userId));
    }
  }

  Lobby.deleteLobby(lobbyId);
}
