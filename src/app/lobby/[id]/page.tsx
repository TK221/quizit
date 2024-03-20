import React from "react";
import { unstable_noStore } from "next/cache";
import { env } from "~/env";
import { getLobby, isPlayerInLobby } from "~/server/game/game";
import Lobby from "~/app/_components/lobby/lobby";
import { getServerAuthSession } from "~/server/auth";

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

  const lobby = getLobby(params.id);

  if (!lobby || !isPlayerInLobby(lobby, session.user.id)) {
    return (
      <div className="mt-20 flex justify-center text-2xl">Lobby not found</div>
    );
  }

  return (
    <Lobby
      pusherSettings={{
        app_host: env.CLIENT_PUSHER_APP_HOST,
        app_key: env.PUSHER_APP_KEY,
        app_port: env.CLIENT_PUSHER_APP_PORT,
      }}
      lobbyId={params.id}
      initialLobby={lobby}
      user={{ id: session.user.id }}
    />
  );
};

export default LobbyPage;
