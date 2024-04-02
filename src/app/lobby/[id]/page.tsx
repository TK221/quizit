import React from "react";
import { unstable_noStore } from "next/cache";
import { env } from "~/env";
import { getLobby, isInLobby } from "~/server/game/lobby";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import Lobby from "~/app/_components/lobby/lobby";

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

  if (!lobby) {
    return (
      <div className="mt-20 flex justify-center text-2xl">Lobby not found</div>
    );
  } else if (!isInLobby(lobby.id, session.user.id))
    redirect(`/lobby?lobbyId=${params.id}`);

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
};

export default LobbyPage;
