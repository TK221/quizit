import { type Player } from "~/server/game/lobby";
import PlayerComponent from "./player";

const PlayerList = (props: { lobbyId: string; players: Player[] }) => {
  return (
    <div className="flex">
      <div className="grow" />
      <div className="flex flex-wrap justify-center">
        {props.players.map((player) => (
          <PlayerComponent
            lobbyId={props.lobbyId}
            key={player.userId}
            player={player}
          />
        ))}
      </div>
      <div className="grow" />
    </div>
  );
};

export default PlayerList;
