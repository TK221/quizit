"use client";

import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePlayerContext } from "~/app/_contexts/player";
import { api } from "~/trpc/react";

const QuestionCounter = (props: {
  currentQuestion: number;
  maxQuestions: number;
}) => {
  const playerContext = usePlayerContext();

  const nextQuestion = api.lobby.nextQuestion.useMutation();
  const previousQuestion = api.lobby.previousQuestion.useMutation();

  return (
    <div className="flex items-center justify-center space-x-2">
      {playerContext.isGameMaster && (
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            previousQuestion.mutate({ lobbyId: playerContext.lobbyId })
          }
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      <div className="space-x-2 border p-2">
        <span className="text-s">Question:</span>
        <span className="text-s font-bold">{props.currentQuestion}</span>
        <span className="text-s">/ {props.maxQuestions}</span>
      </div>
      {playerContext.isGameMaster && (
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            nextQuestion.mutate({ lobbyId: playerContext.lobbyId })
          }
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default QuestionCounter;
