"use client";

import type Pusher from "pusher-js";
import React, { useState } from "react";
import { type Player } from "~/server/game/game";
import PlayerComponent from "./player";

const PlayerList = (props: {
  pusher: Pusher;
  lobbyId: string;
  players: Player[];
  isGameMaster: boolean;
}) => {
  const [players] = useState([
    ...props.players,
    { userId: "1", username: "test", score: 0, lobbyId: "1 " },
  ]);

  return (
    <div className="flex space-x-2">
      {players.map((player) => (
        <PlayerComponent
          key={player.userId}
          player={player}
          isGameMaster={props.isGameMaster}
        />
      ))}
    </div>
  );
};

export default PlayerList;
