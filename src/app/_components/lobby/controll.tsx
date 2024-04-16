"use client";

import React from "react";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import CloseGame from "./close-game";

const Controll = (props: { lobbyId: string }) => {
  const changeState = api.lobby.changeLobbyState.useMutation();

  return (
    <div className="flex-col items-center space-y-4">
      <div className="flex justify-center">
        <CloseGame lobbyId={props.lobbyId} />
      </div>
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
    </div>
  );
};

export default Controll;
