"use client";

import type Pusher from "pusher-js";
import React, { useEffect, useState } from "react";
import { Lobby } from "~/server/game/game";
import pusherInit, {
  type PusherClientSettings,
} from "~/server/pusher/pusher-client";
import PlayerList from "./player-list";

const Lobby = (props: {
  pusherSettings: PusherClientSettings;
  lobbyId: string;
  initialLobby: Lobby;
  user: { id: string };
}) => {
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [lobby, setLobby] = useState<Lobby>(props.initialLobby);
  const isGameMaster = lobby.gameMaster === props.user.id;

  useEffect(() => {
    const p = pusherInit(props.pusherSettings, "/api/pusher/player");
    setPusher(p);

    p.subscribe(`private-lobby-${props.lobbyId}`).bind(
      "update",
      (data: { lobby: Lobby }) => {
        setLobby(data.lobby);
      },
    );

    return () => {
      p.unsubscribe(`private-lobby-${props.lobbyId}`);
    };
  }, [props.pusherSettings, props.lobbyId]);

  if (!pusher) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h1 className="h-12 justify-center">Lobby: {props.lobbyId}</h1>
      <div className="grow" />
      <PlayerList
        pusher={pusher}
        lobbyId={props.lobbyId}
        players={lobby.players}
        isGameMaster={isGameMaster}
      />
    </div>
  );
};

export default Lobby;
