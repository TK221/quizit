import React from "react";
import { unstable_noStore } from "next/cache";
import { env } from "~/env";
import { getLobby } from "~/server/game/game";
import Lobby from "~/app/_components/lobby/lobby";
import { getServerAuthSession } from "~/server/auth";

const LobbyPage = async ({ params }: { params: { id: string } }) => {
  unstable_noStore();

  const session = await getServerAuthSession();

  const lobby = getLobby(params.id);

  if (!session) {
    return <div>Not authenticated</div>;
  }

  if (!lobby) {
    return <div>Lobby not found</div>;
  }

  return (
    <div>
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
    </div>
  );
};

export default LobbyPage;
