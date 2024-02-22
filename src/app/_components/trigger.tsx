"use client";

import React, { useEffect } from "react";
import pusher, {
  type PusherClientSettings,
} from "~/server/pusher/pusher-client";
import { api } from "~/trpc/react";

const Trigger = (props: { pusherSettings: PusherClientSettings }) => {
  const lobbyCreate = api.lobby.create.useMutation();

  useEffect(() => {
    const p = pusher(props.pusherSettings, "/api/pusher/player");

    p.subscribe("private-lobby-cool").bind(
      "trigger",
      (data: { message: string }) => {
        console.log("triggered client", data.message);
      },
    );

    return () => {
      p.unsubscribe("lobby-cool");
    };
  }, [props.pusherSettings]);

  return (
    <div className="flex h-screen flex-col items-center justify-center ">
      <div className="flex flex-col space-y-2 rounded border-2 p-8">
        <button onClick={() => lobbyCreate.mutate({ username: "mark" })}>
          Trigger
        </button>
      </div>
    </div>
  );
};

export default Trigger;
