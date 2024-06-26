"use client";

import React, { useEffect } from "react";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";

const Buzzer = (props: { lobbyId: string; lobbyState: boolean }) => {
  const buzz = api.lobby.buzz.useMutation();

  const handleBuzz = () => {
    buzz.mutate({ lobbyId: props.lobbyId });
  };

  const handleSpacePress = (event: KeyboardEvent) => {
    if (event.key === " ") handleBuzz();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleSpacePress);

    return () => {
      window.removeEventListener("keydown", handleSpacePress);
    };
  });

  return (
    <Button
      variant={props.lobbyState ? "destructive" : "outline"}
      className="h-14 w-40 text-2xl"
      onClick={() => handleBuzz()}
    >
      BUZZ
    </Button>
  );
};

export default Buzzer;
