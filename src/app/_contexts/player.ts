import { createContext, useContext } from "react";

interface PlayerInformation {
  userId: string;
  isGameMaster: boolean;
  lobbyId: string;
}

export const PlayerContext = createContext<PlayerInformation | undefined>(
  undefined,
);

export function usePlayerContext() {
  const playerContext = useContext(PlayerContext);

  if (!playerContext)
    throw new Error(
      "No PlayerContext.Provider found when calling usePlayerContext.",
    );

  return playerContext;
}
