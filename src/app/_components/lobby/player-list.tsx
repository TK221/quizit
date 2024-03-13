"use client";

import type Pusher from "pusher-js";
import React, { useEffect } from "react";
import { type Player } from "~/server/game/game";
import PlayerComponent from "./player";

const PlayerList = (props: {
  pusher: Pusher;
  lobbyId: string;
  players: Player[];
  isGameMaster: boolean;
}) => {
  useEffect(() => {
    props.players.push({
      userId: "1",
      username: "test",
      lobbyId: "1",
      score: 0,
    });

    return () => {
      props.players.pop();
    };
  }, [props.players]);

  return (
    <div className="flex space-x-2">
      {props.players.map((player) => (
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
