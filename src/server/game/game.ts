// --- Game Types ---
export interface Player {
  userId: string;
  username: string;
  score: number;
  lobbyId: string;
}

export interface Lobby {
  id: string;
  name: string;
  players: Player[];
  gameMaster: string;
  open: boolean;
  playerBuzzing?: Player;
}

// --- Game Elements ---
const games = new Map<string, Lobby>();

// --- Game Logic ---
export function createLobby(userId: string, lobbyName: string): string {
  const lobbyId = Math.random().toString(36).slice(2);

  if (isLobbyExist(lobbyId)) throw new Error("Lobby already exists");

  games.set(lobbyId, {
    id: lobbyId,
    name: lobbyName,
    players: [],
    gameMaster: userId,
    open: false,
  });

  return lobbyId;
}

export function getLobby(lobbyId: string): Lobby | undefined {
  return games.get(lobbyId);
}

export function joinLobby(
  lobbyId: string,
  userId: string,
  username: string,
): void {
  const lobby = getLobby(lobbyId);

  if (!lobby || isPlayerInLobby(lobby.id, userId))
    throw new Error("Lobby not found");

  lobby.players.push({
    lobbyId: lobbyId,
    userId: userId,
    username,
    score: 0,
  });
}

export function leaveLobby(lobbyId: string, playerId: string): boolean {
  const lobby = getLobby(lobbyId);
  if (!lobby) return false;

  // Delete the lobby if the game master leaves
  if (lobby.gameMaster === playerId) {
    games.delete(lobbyId);
    return true;
  }

  // Slice the player from lobby
  const index = lobby.players.findIndex((p) => p.userId === playerId);
  if (index === -1) return false;

  lobby.players.splice(index, 1);
  return true;
}

export function openLobby(lobbyId: string): boolean {
  const lobby = getLobby(lobbyId);
  if (!lobby) return false;

  lobby.open = true;
  resetPlayerBuzzing(lobbyId);
  return true;
}

export function closeLobby(lobbyId: string): boolean {
  const lobby = getLobby(lobbyId);
  if (!lobby) return false;

  lobby.open = false;
  return true;
}

export function playerBuzzing(lobbyId: string, playerId: string): Player {
  const lobby = getLobby(lobbyId);
  if (!lobby) throw new Error("Lobby not found");

  const player = getPlayer(lobby, playerId);

  if (!player) throw new Error("Player not found");

  if (!lobby.open) throw new Error("Lobby is not open");

  lobby.open = false;
  lobby.playerBuzzing = player;

  return player;
}

export function increasePlayerScore(
  lobbyId: string,
  playerId: string,
  points: number,
): void {
  const lobby = games.get(lobbyId);
  if (!lobby) throw new Error("Lobby not found");

  const player = getPlayer(lobby, playerId);

  if (!player) throw new Error("Player not found");

  player.score += points;
}

export function decreasePlayerScore(
  lobbyId: string,
  playerId: string,
  points: number,
): void {
  const lobby = games.get(lobbyId);
  if (!lobby) throw new Error("Lobby not found");

  const player = getPlayer(lobby, playerId);

  if (!player) throw new Error("Player not found");

  player.score -= points;

  if (player.score < 0) player.score = 0;
}

export function correctAnswer(lobbyId: string): void {
  const buzzingPlayer = getBuzzingPlayer(lobbyId);

  if (!buzzingPlayer) throw new Error("No player buzzing");

  increasePlayerScore(lobbyId, buzzingPlayer.userId, 3);

  resetPlayerBuzzing(lobbyId);
}

export function wrongAnswer(lobbyId: string): void {
  const buzzingPlayer = getBuzzingPlayer(lobbyId);
  if (!buzzingPlayer) throw new Error("No player buzzing");

  const players = getPlayers(lobbyId);

  players.forEach((player) => {
    if (player.userId !== buzzingPlayer.userId)
      increasePlayerScore(lobbyId, player.userId, 1);
  });

  resetPlayerBuzzing(lobbyId);
}

// --- Help functions ---
function isLobbyExist(lobbyId: string): boolean {
  return games.has(lobbyId);
}

export function isPlayerInLobby(lobbyId: string, playerId: string): boolean {
  const lobby = getLobby(lobbyId);
  if (!lobby) return false;

  return (
    lobby.players.find((p) => p.userId === playerId) !== undefined ||
    lobby.gameMaster === playerId
  );
}

export function isPlayerGameMaster(lobbyId: string, playerId: string): boolean {
  const lobby = getLobby(lobbyId);
  if (!lobby) return false;

  return lobby.gameMaster === playerId;
}

function getPlayer(lobby: Lobby, player: string): Player | undefined {
  return lobby.players.find((p) => p.userId === player);
}

function getPlayers(lobbyId: string): Player[] {
  const lobby = getLobby(lobbyId);
  if (!lobby) throw new Error("Lobby not found");

  return lobby.players;
}

function resetPlayerBuzzing(lobbyId: string): void {
  const lobby = getLobby(lobbyId);
  if (!lobby) throw new Error("Lobby not found");

  lobby.playerBuzzing = undefined;
}

function getBuzzingPlayer(lobbyId: string): Player | undefined {
  const lobby = getLobby(lobbyId);
  if (!lobby) throw new Error("Lobby not found");

  return lobby.playerBuzzing;
}
