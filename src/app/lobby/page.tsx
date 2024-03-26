"use client";

import React from "react";
import JoinLobby from "../_components/join-lobby";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../_components/ui/tabs";
import CreateLobby from "../_components/create-lobby";
import { useSearchParams } from "next/navigation";

const LobbyMenu = () => {
  const searchParams = useSearchParams();

  const lobbyId = searchParams.get("lobbyId");

  return (
    <div className="flex h-full items-center justify-center">
      <Tabs defaultValue="join" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="join">Join Lobby</TabsTrigger>
          <TabsTrigger value="create">Create Lobby</TabsTrigger>
        </TabsList>
        <TabsContent value="join">
          <JoinLobby lobbyId={lobbyId ?? undefined} />
        </TabsContent>
        <TabsContent value="create">
          <CreateLobby />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LobbyMenu;
