"use client";

import React from "react";
import { Player } from "~/server/game/game";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { api } from "~/trpc/react";

const Player = (props: {
  lobbyId: string;
  player: Player;
  isGameMaster: boolean;
}) => {
  const increaseScore = api.lobby.increaseScore.useMutation();
  const decreaseScore = api.lobby.decreaseScore.useMutation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {props.player.username}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex-col space-y-2">
          <div>
            Points: <b>{props.player.score}</b>
          </div>
          {props.isGameMaster && (
            <div className="flex w-full space-x-2">
              <div className="flex grow items-center justify-center">
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
              </div>
              <div className="flex grow items-center justify-center">
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
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Player;
