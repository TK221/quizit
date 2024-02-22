// --- Game Types ---
export interface Player {
  user_id: string;
  username: string;
  score: number;
  lobby_id: string;
}

export interface Lobby {
  lobby_id: string;
  players: Player[];
  game_master: Player;
  open: boolean;
  playerBuzzingList: Player[];
}

// --- Game Elements ---
const games = new Map<string, Lobby>();

// --- Game Logic ---
export function createLobby(
  user_id: string,
  username: string,
): string | undefined {
  const lobby_id = Math.random().toString(36).slice(2);

  if (isLobbyExist(lobby_id)) return undefined;

  games.set(lobby_id, {
    lobby_id,
    players: [],
    game_master: {
      user_id: user_id,
      username,
      score: 0,
      lobby_id,
    },
    open: false,
    playerBuzzingList: [],
  });

  return lobby_id;
}

export function getLobby(lobby_id: string): Lobby | undefined {
  return games.get(lobby_id);
}

export function joinLobby(
  lobby_id: string,
  user_id: string,
  username: string,
): Lobby | undefined {
  const lobby = getLobby(lobby_id);

  if (!lobby || isPlayerInLobby(lobby, user_id)) return undefined;

  lobby.players.push({ lobby_id, user_id, username, score: 0 });

  return lobby;
}

export function leaveLobby(lobby_id: string, player: string): boolean {
  const lobby = getLobby(lobby_id);
  if (!lobby) return false;

  // Delete the lobby if the game master leaves
  if (isPlayerGameMaster(lobby, player)) {
    games.delete(lobby_id);
    return true;
  }

  // Slice the player from lobby
  const index = lobby.players.findIndex((p) => p.user_id === player);
  if (index === -1) return false;

  lobby.players.splice(index, 1);
  return true;
}

export function openLobby(lobby_id: string): boolean {
  const lobby = getLobby(lobby_id);
  if (!lobby) return false;

  lobby.open = true;
  return true;
}

export function closeLobby(lobby_id: string): boolean {
  const lobby = getLobby(lobby_id);
  if (!lobby) return false;

  lobby.open = false;
  return true;
}

export function playerBuzzing(lobby_id: string, player: string): boolean {
  const lobby = getLobby(lobby_id);
  if (!lobby) return false;

  const p = getPlayer(lobby, player);

  if (!p) return false;

  if (!lobby.open) return false;

  lobby.open = false;
  lobby.playerBuzzingList.push(p);

  return true;
}

export function addPlayerScore(lobby_id: string, player: string): boolean {
  const lobby = games.get(lobby_id);
  if (!lobby) return false;

  const p = getPlayer(lobby, player);

  if (!p) return false;

  p.score++;

  return true;
}

export function removePlayerScore(lobby_id: string, player: string): boolean {
  const lobby = games.get(lobby_id);
  if (!lobby) return false;

  const p = getPlayer(lobby, player);

  if (!p) return false;

  if (p.score > 0) p.score--;

  return true;
}

// --- Help functions ---
function isLobbyExist(lobby_id: string): boolean {
  return games.has(lobby_id);
}

function isPlayerInLobby(lobby: Lobby, player: string): boolean {
  return (
    lobby.players.find((p) => p.user_id === player) !== undefined ||
    lobby.game_master.user_id === player
  );
}

function isPlayerGameMaster(lobby: Lobby, player: string): boolean {
  return lobby.game_master.user_id === player;
}

function getPlayer(lobby: Lobby, player: string): Player | undefined {
  return lobby.players.find((p) => p.user_id === player);
}
