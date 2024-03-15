"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import type Pusher from "pusher-js";
import { type Player } from "~/server/game/game";
import { api } from "~/trpc/react";

const Controll = (props: {
  lobbyId: string;
  pusher: Pusher;
  lobbyState: boolean;
}) => {
  const [buzzedPlayer, setBuzzedPlayer] = useState<Player | null>(null);

  const changeState = api.lobby.changeLobbyState.useMutation();

  useEffect(() => {
    props.pusher.bind("buzz", (data: { player: Player }) => {
      setBuzzedPlayer(data.player);
    });
  }, [props.pusher]);

  return (
    <div className="flex-col place-items-center space-y-2">
      <div className="flex space-x-4">
        <Button
          variant="default"
          className="w-16"
          onClick={() =>
            changeState.mutate({ lobbyId: props.lobbyId, open: true })
          }
        >
          Open
        </Button>
        <Button
          variant="destructive"
          className="w-16"
          onClick={() =>
            changeState.mutate({ lobbyId: props.lobbyId, open: false })
          }
        >
          Close
        </Button>
      </div>
      <h1 className="text-center">
        {props.lobbyState
          ? "open for buzzing..."
          : buzzedPlayer
            ? `${buzzedPlayer.username} buzzed!`
            : "closed for buzzing!"}
      </h1>
    </div>
  );
};

export default Controll;
