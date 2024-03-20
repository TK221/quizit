import React from "react";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";

const Buzzer = (props: { lobbyId: string; lobbyState: boolean }) => {
  const buzz = api.lobby.buzz.useMutation();

  return (
    <Button
      variant={props.lobbyState ? "destructive" : "outline"}
      className="h-52 w-52"
      onClick={() => buzz.mutate({ lobbyId: props.lobbyId })}
    >
      {props.lobbyState ? "BUZZ" : "CLOSED"}
    </Button>
  );
};

export default Buzzer;
