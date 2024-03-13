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
): Lobby | undefined {
  const lobby = getLobby(lobbyId);

  if (!lobby || isPlayerInLobby(lobby, userId)) return undefined;

  lobby.players.push({
    lobbyId: lobbyId,
    userId: userId,
    username,
    score: 0,
  });

  return lobby;
}

export function leaveLobby(lobbyId: string, player: string): boolean {
  const lobby = getLobby(lobbyId);
  if (!lobby) return false;

  // Delete the lobby if the game master leaves
  if (isPlayerGameMaster(lobby, player)) {
    games.delete(lobbyId);
    return true;
  }

  // Slice the player from lobby
  const index = lobby.players.findIndex((p) => p.userId === player);
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

export function playerBuzzing(lobbyId: string, player: string): boolean {
  const lobby = getLobby(lobbyId);
  if (!lobby) return false;

  const p = getPlayer(lobby, player);

  if (!p) return false;

  if (!lobby.open) return false;

  lobby.open = false;
  lobby.playerBuzzingList.push(p);

  return true;
}

export function addPlayerScore(lobbyId: string, player: string): boolean {
  const lobby = games.get(lobbyId);
  if (!lobby) return false;

  const p = getPlayer(lobby, player);

  if (!p) return false;

  p.score++;

  return true;
}

export function removePlayerScore(lobbyId: string, player: string): boolean {
  const lobby = games.get(lobbyId);
  if (!lobby) return false;

  const p = getPlayer(lobby, player);

  if (!p) return false;

  if (p.score > 0) p.score--;

  return true;
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

function isPlayerGameMaster(lobby: Lobby, player: string): boolean {
  return lobby.gameMaster === player;
}

function getPlayer(lobby: Lobby, player: string): Player | undefined {
  return lobby.players.find((p) => p.userId === player);
}
