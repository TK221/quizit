// --- Game Types ---
export interface Player {
  userId: string;
  username: string;
  score: number;
  lobbyId: string;
}

export interface Lobby {
  id: string;
  players: Player[];
  gameMaster: string;
  open: boolean;
  playerBuzzingList: Player[];
}

// --- Game Elements ---
const games = new Map<string, Lobby>();

// --- Game Logic ---
export function createLobby(userId: string): string | undefined {
  const lobbyId = Math.random().toString(36).slice(2);

  if (isLobbyExist(lobbyId)) return undefined;

  games.set(lobbyId, {
    id: lobbyId,
    players: [],
    gameMaster: userId,
    open: false,
    playerBuzzingList: [],
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

  if (!lobby || isPlayerInLobby(lobby, userId))
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
  lobby.playerBuzzingList.push(player);

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

// --- Help functions ---
function isLobbyExist(lobbyId: string): boolean {
  return games.has(lobbyId);
}

function isPlayerInLobby(lobby: Lobby, player: string): boolean {
  return (
    lobby.players.find((p) => p.userId === player) !== undefined ||
    lobby.gameMaster === player
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
