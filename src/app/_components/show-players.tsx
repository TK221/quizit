"use client";

import React from "react";
import { usePlayerContext } from "../_contexts/player";

const ShowPlayers = ({ children }: { children: React.ReactNode }) => {
  const playerContext = usePlayerContext();

  if (playerContext.isGameMaster === false) {
    return <>{children}</>;
  } else return null;
};

export default ShowPlayers;
