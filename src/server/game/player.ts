import { TRPCError } from "@trpc/server";
import * as Lobby from "./lobby";

export function playerBuzzing(lobbyId: string, playerId: string): Lobby.Player {
  const player = Lobby.getPlayer(lobbyId, playerId);
  const lobby = Lobby.getLobby(lobbyId);

  if (Lobby.isLobbyOpen(lobbyId) === false)
    throw new TRPCError({
      code: "CONFLICT",
      message: "Lobby is closed for buzzing",
    });

  lobby.open = false;
  lobby.buzzingPlayer = player;

  return player;
}
