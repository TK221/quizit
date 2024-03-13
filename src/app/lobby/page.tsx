import React from "react";
import JoinLobby from "../_components/join-lobby";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../_components/ui/tabs";
import CreateLobby from "../_components/create-lobby";

const LobbyMenu = () => {
  return (
    <div className="mt-20 flex items-center justify-center">
      <Tabs defaultValue="create" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Lobby</TabsTrigger>
          <TabsTrigger value="join">Join Lobby</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <CreateLobby />
        </TabsContent>
        <TabsContent value="join">
          <JoinLobby />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LobbyMenu;
