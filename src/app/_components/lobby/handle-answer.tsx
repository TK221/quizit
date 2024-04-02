"use client";

import React from "react";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import { CardFooter } from "../ui/card";

const HandleAnswer = (props: { lobbyId: string; buzzingPlayerId: string }) => {
  const correctAnswer = api.lobby.correctAnswer.useMutation();
  const wrongAnswer = api.lobby.wrongAnswer.useMutation();

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      correctAnswer.mutate({
        lobbyId: props.lobbyId,
      });
    } else {
      wrongAnswer.mutate({
        lobbyId: props.lobbyId,
      });
    }
  };

  return (
    <CardFooter className="flex justify-between space-x-4">
      <Button onClick={() => handleAnswer(true)}>Correct</Button>
      <Button onClick={() => handleAnswer(false)} variant="destructive">
        Wrong
      </Button>
    </CardFooter>
  );
};

export default HandleAnswer;
