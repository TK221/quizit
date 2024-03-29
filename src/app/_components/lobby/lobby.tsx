"use client";

import type Pusher from "pusher-js";
import React, { useEffect, useState } from "react";
import { Lobby } from "~/server/game/game";
import pusherInit, {
  type PusherClientSettings,
} from "~/server/pusher/pusher-client";
import PlayerList from "./player-list";
import Buzzer from "./buzzer";
import Controll from "./controll";
import BuzzInfo from "./buzz-info";

export const IsGameMasterContext = React.createContext<boolean>(false);

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
    <IsGameMasterContext.Provider value={isGameMaster}>
      <div className="flex h-full flex-col items-center space-y-4 p-4">
        <h1 className="h-20 shrink  text-3xl font-bold">{lobby.name}</h1>
        <div className="flex grow flex-col items-center space-y-4">
          {isGameMaster ? (
            <Controll lobbyId={props.lobbyId} />
          ) : (
            <Buzzer lobbyId={props.lobbyId} lobbyState={lobby.open} />
          )}
          <BuzzInfo pusher={pusher} lobby={lobby} />
        </div>
        <div>
          {lobby.players.length > 0 ? (
            <PlayerList lobbyId={props.lobbyId} players={lobby.players} />
          ) : (
            <p className="w-full text-center">No connected players</p>
          )}
        </div>
      </div>
    </IsGameMasterContext.Provider>
  );
};

export default Lobby;
