"use client";

import type Pusher from "pusher-js";
import React, { useContext } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import type Lobby from "./lobby";
import HandleAnswer from "./handle-answer";
import { IsGameMasterContext } from "./lobby";

const BuzzInfo = (props: { pusher: Pusher; lobby: Lobby }) => {
  const isGameMaster = useContext(IsGameMasterContext);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {props.lobby.open
              ? "open for buzzing..."
              : props.lobby.playerBuzzing
                ? `${props.lobby.playerBuzzing.username} buzzed!`
                : "Closed"}
          </CardTitle>
        </CardHeader>
        {isGameMaster && props.lobby.playerBuzzing && (
          <HandleAnswer
            lobbyId={props.lobby.id}
            buzzingPlayerId={props.lobby.playerBuzzing.userId}
          />
        )}
      </Card>
    </div>
  );
};

export default BuzzInfo;
