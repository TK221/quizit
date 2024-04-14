"use client";

import React from "react";
import { usePlayerContext } from "../_contexts/player";

const ShowGameMaster = ({ children }: { children: React.ReactNode }) => {
  const playerContext = usePlayerContext();

  if (playerContext.isGameMaster) {
    return <>{children}</>;
  } else return null;
};

export default ShowGameMaster;
