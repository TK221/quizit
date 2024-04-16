"use client";

import type Pusher from "pusher-js";
import React, { useEffect, useState } from "react";
import { type Lobby as GameLobby } from "~/server/game/lobby";
import pusherInit, {
  type PusherClientSettings,
} from "~/server/pusher/pusher-client";
import PlayerList from "./player-list";
import Buzzer from "./buzzer";
import Controll from "./controll";
import BuzzInfo from "./buzz-info";
import { PlayerContext } from "~/app/_contexts/player";
import LoadingSpinner from "../loading-spinner";
import QuestionCounter from "./question-counter";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ShowGameMaster from "../show-gamemaster";
import ShowPlayers from "../show-players";
import DisplayInput from "./display-input";
import Display from "./display";

const Lobby = (props: {
  pusherSettings: PusherClientSettings;
  lobbyId: string;
  initialLobby: GameLobby;
  userId: string;
}) => {
  const router = useRouter();

  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [lobby, setLobby] = useState<GameLobby>(props.initialLobby);

  const isGameMaster = lobby.gameMaster === props.userId;

  useEffect(() => {
    const p = pusherInit(props.pusherSettings, "/api/pusher/player");
    setPusher(p);

    p.subscribe(`private-lobby-${props.lobbyId}`)
      .bind("update", (data: { lobby: GameLobby }) => {
        setLobby(data.lobby);
      })
      .bind("close-lobby", (data: { canceled: boolean }) => {
        if (data.canceled)
          toast.warning("Your game has been canceled", {
            description:
              "The Gamemaster has canceled the game. Lobby progress is lost.",
            duration: 10000,
          });
        else
          toast.success("The game has ended", {
            description:
              "The Gamemaster has ended the game. Lobby progress is saved and added to the Leaderboard.",
            duration: 10000,
          });

        router.push("/");
      });

    return () => {
      p.unsubscribe(`private-lobby-${props.lobbyId}`);
    };
  }, [props.pusherSettings, props.lobbyId, router]);

  if (!pusher) {
    return (
      <div className="flex h-full justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <PlayerContext.Provider
      value={{
        userId: props.userId,
        isGameMaster: isGameMaster,
        lobbyId: props.lobbyId,
      }}
    >
      <div className="flex h-full w-full flex-col items-center space-y-4 p-4">
        {/* Title */}
        <h1 className="h-14 shrink py-2 text-3xl font-bold">{lobby.name}</h1>
        {/* Controls */}
        <div>
          <ShowPlayers>
            <Buzzer lobbyId={props.lobbyId} lobbyState={lobby.open} />
          </ShowPlayers>
          <ShowGameMaster>
            <Controll lobbyId={props.lobbyId} />
          </ShowGameMaster>
        </div>
        {/* Informations */}
        <div className="flex flex-col space-y-2">
          <QuestionCounter
            currentQuestion={lobby.currentQuestion}
            maxQuestions={lobby.settings.maxQuestions}
          />
          <BuzzInfo pusher={pusher} lobby={lobby} />
        </div>
        {/* Display */}
        <div className="flex w-full grow flex-col space-y-2 overflow-auto px-4 md:w-2/3 lg:w-1/3">
          <p className="text-center text-lg font-bold">Text Display</p>
          <ShowGameMaster>
            <DisplayInput text={lobby.textDisplay} />
          </ShowGameMaster>
          <ShowPlayers>
            <Display text={lobby.textDisplay} />
          </ShowPlayers>
        </div>
        {/* Players */}
        <div className="w-full">
          {lobby.players.length > 0 ? (
            <PlayerList lobbyId={props.lobbyId} players={lobby.players} />
          ) : (
            <p className="w-full text-center">No connected players</p>
          )}
        </div>
      </div>
    </PlayerContext.Provider>
  );
};

export default Lobby;
