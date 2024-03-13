"use client";

import React from "react";
import { Player } from "~/server/game/game";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";

const Player = (props: { player: Player; isGameMaster: boolean }) => {
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
          <div className="flex w-full space-x-2">
            <div className="flex grow items-center justify-center">
              <Button>+</Button>
            </div>
            <div className="flex grow items-center justify-center">
              <Button>-</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Player;
