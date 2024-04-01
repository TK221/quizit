"use client";

import type Pusher from "pusher-js";
import React, { useContext, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import type Lobby from "./lobby";
import HandleAnswer from "./handle-answer";
import { IsGameMasterContext } from "./lobby";

const BuzzInfo = (props: { pusher: Pusher; lobby: Lobby }) => {
  const audio = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined"
      ? new Audio("/sounds/buzzing-sound.mp3")
      : undefined,
  );

  const isGameMaster = useContext(IsGameMasterContext);

  useEffect(() => {
    props.pusher.bind("buzz", async () => {
      await audio.current?.play();
    });

    return () => {
      props.pusher.unbind("buzz");
    };
  }, [props.pusher]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {props.lobby.open
              ? "open for buzzing..."
              : props.lobby.buzzingPlayer
                ? `${props.lobby.buzzingPlayer.username} buzzed!`
                : "Closed"}
          </CardTitle>
        </CardHeader>
        {isGameMaster && props.lobby.buzzingPlayer && (
          <HandleAnswer
            lobbyId={props.lobby.id}
            buzzingPlayerId={props.lobby.buzzingPlayer.userId}
          />
        )}
      </Card>
    </div>
  );
};

export default BuzzInfo;
