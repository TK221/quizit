"use client";

import type Pusher from "pusher-js";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import type Lobby from "./lobby";
import HandleAnswer from "./handle-answer";
import { usePlayerContext } from "~/app/_contexts/player";

const BuzzInfo = (props: { pusher: Pusher; lobby: Lobby }) => {
  const playerContext = usePlayerContext();

  const [revealResult, setReveal] = useState<boolean | undefined>(undefined);

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

    props.pusher.bind("reveal", async (data: { correct: boolean }) => {
      if (data.correct) {
        await correctAudio.current?.play();
      } else {
        await incorrectAudio.current?.play();
      }

      setReveal(data.correct);
      deleteRevealAfterTime();
    });

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
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {props.lobby.open
              ? "open for buzzing..."
              : props.lobby.buzzingPlayer
                ? `${props.lobby.buzzingPlayer.username} buzzed!`
                : revealResult !== undefined
                  ? `The answer was ${revealResult ? "Correct" : "Incorrect"}`
                  : "Closed"}
          </CardTitle>
        </CardHeader>
        {playerContext.isGameMaster && props.lobby.buzzingPlayer && (
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
