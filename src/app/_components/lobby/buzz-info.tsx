"use client";

import type Pusher from "pusher-js";
import React, { useEffect, useRef, useState } from "react";
import HandleAnswer from "./handle-answer";
import { usePlayerContext } from "~/app/_contexts/player";
import { type Player, type Lobby } from "~/server/game/lobby";

const BuzzInfo = (props: { pusher: Pusher; lobby: Lobby }) => {
  const playerContext = usePlayerContext();

  const [revealResult, setReveal] = useState<
    { correct: boolean; playerName: string } | undefined
  >(undefined);

  const buzzAudio = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined"
      ? new Audio("/sounds/buzzing-sound.mp3")
      : undefined,
  );

  const correctAudio = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined" ? new Audio("/sounds/correct.mp3") : undefined,
  );

  const incorrectAudio = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined"
      ? new Audio("/sounds/incorrect.mp3")
      : undefined,
  );

  useEffect(() => {
    props.pusher.bind("buzz", async () => {
      await buzzAudio.current?.play();
    });

    props.pusher.bind(
      "reveal",
      async (data: { correct: boolean; player: Player }) => {
        if (data.correct) {
          await correctAudio.current?.play();
        } else {
          await incorrectAudio.current?.play();
        }

        setReveal({ correct: data.correct, playerName: data.player.username });
        deleteRevealAfterTime();
      },
    );

    return () => {
      props.pusher.unbind("buzz");
      props.pusher.unbind("reveal");
    };
  }, [props.pusher]);

  const deleteRevealAfterTime = () => {
    setTimeout(() => {
      setReveal(undefined);
    }, 5000);
  };

  return (
    <div className="flex flex-col items-center space-y-2 border px-4 py-2">
      <div className="text-xl">
        {props.lobby.open
          ? "open for buzzing..."
          : props.lobby.buzzingPlayer
            ? `${props.lobby.buzzingPlayer.username} buzzed!`
            : revealResult !== undefined
              ? `The answer of ${revealResult.playerName} was ${revealResult.correct ? "Correct" : "Incorrect"}`
              : "Buzzing is CLOSED"}
      </div>
      {playerContext.isGameMaster && props.lobby.buzzingPlayer && (
        <HandleAnswer
          lobbyId={props.lobby.id}
          buzzingPlayerId={props.lobby.buzzingPlayer.userId}
        />
      )}
    </div>
  );
};

export default BuzzInfo;
