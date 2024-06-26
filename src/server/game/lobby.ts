import { TRPCError } from "@trpc/server";

// --- Game Types ---
export interface Player {
  userId: string;
  username: string;
  score: number;
  lobbyId: string;
  correctAnswers: number;
  wrongAnswers: number;
}

export interface Lobby {
  id: string;
  name: string;
  players: Player[];
  gameMaster: string;
  open: boolean;
  buzzingPlayer?: Player;
  currentQuestion: number;
  textDisplay: string;
  settings: LobbySettings;
}

export interface LobbySettings {
  maxQuestions: number;
  correctAnswerPoints: number;
  wrongAnswerPoints: number;
}

// --- Game Elements ---
const games = new Map<string, Lobby>();

// --- Game Logic ---
export function createLobby(
  userId: string,
  lobbyName: string,
  settings: LobbySettings,
): string {
  const lobbyId = Math.random().toString(36).slice(2);

  if (isLobbyExist(lobbyId))
    throw new TRPCError({ code: "CONFLICT", message: "Lobby already exists" });

  games.set(lobbyId, {
    id: lobbyId,
    name: lobbyName,
    players: [],
    gameMaster: userId,
    open: false,
    currentQuestion: 1,
    textDisplay: "",
    settings,
  });

  return lobbyId;
}

export function getLobby(lobbyId: string): Lobby {
  const lobby = games.get(lobbyId);

  if (!lobby)
    throw new TRPCError({ code: "NOT_FOUND", message: "Lobby not found" });

  return lobby;
}

export function deleteLobby(lobbyId: string): void {
  games.delete(lobbyId);
}

export function joinLobby(
  lobbyId: string,
  userId: string,
  username: string,
): void {
  const lobby = getLobby(lobbyId);

  if (isPlayer(lobby.id, userId))
    throw new TRPCError({
      code: "CONFLICT",
      message: "Player already in lobby",
    });

  lobby.players.push({
    lobbyId,
    userId,
    username,
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });
}

export function leaveLobby(lobbyId: string, playerId: string): void {
  const lobby = getLobby(lobbyId);

  // Delete the lobby if the game master leaves
  if (lobby.gameMaster === playerId) {
    games.delete(lobbyId);
    return;
  }

  // Slice the player from lobby
  const index = lobby.players.findIndex((p) => p.userId === playerId);
  if (index === -1)
    throw new TRPCError({ code: "NOT_FOUND", message: "Player not found" });

  lobby.players.splice(index, 1);
}

export function getPlayers(lobbyId: string): Player[] {
  const lobby = getLobby(lobbyId);

  return lobby.players;
}

export function getPlayer(lobbyId: string, playerId: string): Player {
  const lobby = getLobby(lobbyId);

  const player = lobby.players.find((p) => p.userId === playerId);
  if (!player)
    throw new TRPCError({ code: "NOT_FOUND", message: "Player not found" });

  return player;
}

export function resetBuzzingPlayer(lobbyId: string): void {
  const lobby = getLobby(lobbyId);

  lobby.buzzingPlayer = undefined;
}

export function getBuzzingPlayer(lobbyId: string): Player | undefined {
  const lobby = getLobby(lobbyId);

  return lobby.buzzingPlayer;
}

export function getPlayerWithHighestScore(lobbyId: string): Player | null {
  const players = getPlayers(lobbyId);

  if (players.length === 0) return null;

  return players.reduce((prev, current) =>
    prev.score > current.score ? prev : current,
  );
}

export function getLobbySettings(lobbyId: string): LobbySettings {
  const lobby = getLobby(lobbyId);

  return lobby.settings;
}

// --- Help functions ---
export function isLobbyExist(lobbyId: string): boolean {
  return games.has(lobbyId);
}

export function isInLobby(lobbyId: string, playerId: string): boolean {
  const lobby = getLobby(lobbyId);

  return (
    lobby.players.find((p) => p.userId === playerId) !== undefined ||
    lobby.gameMaster === playerId
  );
}

export function isPlayer(lobbyId: string, playerId: string): boolean {
  const lobby = getLobby(lobbyId);

  return lobby.players.find((p) => p.userId === playerId) !== undefined;
}

export function isGamemaster(lobbyId: string, playerId: string): boolean {
  const lobby = getLobby(lobbyId);

  return lobby.gameMaster === playerId;
}

export function isLobbyOpen(lobbyId: string): boolean {
  const lobby = getLobby(lobbyId);

  return lobby.open;
}
