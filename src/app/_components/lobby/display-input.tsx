"use client";

import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { usePlayerContext } from "~/app/_contexts/player";

const DisplayInput = (props: { text: string }) => {
  const [text, setText] = useState(props.text);

  const playerContext = usePlayerContext();

  const updateTextDisplay = api.lobby.updateDisplayText.useMutation();

  return (
    <div className="flex flex-col space-y-2">
      <Textarea
        className="w-full"
        value={text}
        placeholder="Enter text to display"
        onChange={(e) => setText(e.target.value)}
      />
      <Button
        onClick={() =>
          updateTextDisplay.mutate({ lobbyId: playerContext.lobbyId, text })
        }
      >
        Update
      </Button>
    </div>
  );
};

export default DisplayInput;
