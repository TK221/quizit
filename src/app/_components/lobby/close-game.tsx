"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";

const CloseGame = (props: { lobbyId: string }) => {
  const endGame = api.lobby.endGame.useMutation();
  const cancelGame = api.lobby.cancelGame.useMutation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Close Lobby</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure to end the game?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You can cacncel the game like it never
            happened or end the game and save the result.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => cancelGame.mutate({ lobbyId: props.lobbyId })}
          >
            Cancel Game
          </AlertDialogAction>
          <AlertDialogAction
            onClick={() => endGame.mutate({ lobbyId: props.lobbyId })}
          >
            End Game
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CloseGame;
