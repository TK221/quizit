"use client";

import React from "react";
import { type Player as GamePlayer } from "~/server/game/lobby";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { CheckIcon, MinusIcon, PlusIcon, XIcon } from "lucide-react";
import { api } from "~/trpc/react";
import ShowGameMaster from "../show-gamemaster";

const Player = (props: { lobbyId: string; player: GamePlayer }) => {
  const increaseScore = api.lobby.increaseScore.useMutation();
  const decreaseScore = api.lobby.decreaseScore.useMutation();
  const correctAnswers = api.lobby.correctAnswer.useMutation();
  const wrongAnswers = api.lobby.wrongAnswer.useMutation();

  return (
    <Card className="min-w-64">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {props.player.username}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex-col space-y-2">
          <p className="text-lg">
            Points: <b>{props.player.score}</b>
          </p>
          <p className="text-xs">
            Correct: <b>{props.player.correctAnswers}</b>
          </p>
          <p className="text-xs">
            Wrong: <b>{props.player.wrongAnswers}</b>
          </p>
        </div>
      </CardContent>
      <ShowGameMaster>
        <CardFooter className="flex justify-between space-x-2">
          <Button
            onClick={() =>
              increaseScore.mutate({
                lobbyId: props.lobbyId,
                userId: props.player.userId,
                points: 1,
              })
            }
          >
            <PlusIcon />
          </Button>
          <Button
            onClick={() =>
              correctAnswers.mutate({
                lobbyId: props.lobbyId,
                userId: props.player.userId,
              })
            }
          >
            <CheckIcon />
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              wrongAnswers.mutate({
                lobbyId: props.lobbyId,
                userId: props.player.userId,
              })
            }
          >
            <XIcon />
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              decreaseScore.mutate({
                lobbyId: props.lobbyId,
                userId: props.player.userId,
                points: 1,
              })
            }
          >
            <MinusIcon />
          </Button>
        </CardFooter>
      </ShowGameMaster>
    </Card>
  );
};

export default Player;
