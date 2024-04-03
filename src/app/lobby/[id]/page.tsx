import React from "react";
import { unstable_noStore } from "next/cache";
import { env } from "~/env";
import { getLobby, isInLobby, joinLobby } from "~/server/game/lobby";
import { getServerAuthSession } from "~/server/auth";
import Lobby from "~/app/_components/lobby/lobby";
import { TRPCError } from "@trpc/server";
import { updateLobby } from "~/server/api/routers/lobby";

const LobbyPage = async ({ params }: { params: { id: string } }) => {
  unstable_noStore();

  const session = await getServerAuthSession();

  if (!session) {
    return (
      <div className="mt-20 flex justify-center text-2xl">
        Not authenticated
      </div>
    );
  }

  try {
    if (!isInLobby(params.id, session.user.id)) {
      joinLobby(params.id, session.user.id, session.user.name);
      await updateLobby(params.id);
    }

    const lobby = getLobby(params.id);
    return (
      <Lobby
        pusherSettings={{
          app_host: env.CLIENT_PUSHER_APP_HOST,
          app_key: env.PUSHER_APP_KEY,
          app_port: env.CLIENT_PUSHER_APP_PORT,
        }}
        lobbyId={params.id}
        initialLobby={lobby}
        userId={session.user.id}
      />
    );
  } catch (e) {
    if (e instanceof TRPCError) {
      return (
        <div className="mt-20 flex justify-center text-2xl">
          Lobby not found
        </div>
      );
    } else throw e;
  }
};

export default LobbyPage;
