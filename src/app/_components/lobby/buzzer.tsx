import React from "react";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";

const Buzzer = (props: { lobbyId: string; lobbyState: boolean }) => {
  const buzz = api.lobby.buzz.useMutation();

  return (
    <Button
      variant={props.lobbyState ? "secondary" : "destructive"}
      className="h-full w-full"
      onClick={() => buzz.mutate({ lobbyId: props.lobbyId })}
    >
      Buzzer
    </Button>
  );
};

export default Buzzer;
