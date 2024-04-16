import { type Player } from "~/server/game/lobby";
import PlayerComponent from "./player";

const PlayerList = (props: { lobbyId: string; players: Player[] }) => {
  return (
    <div className="flex space-x-2">
      <div className="grow" />
      {props.players.map((player) => (
        <PlayerComponent
          lobbyId={props.lobbyId}
          key={player.userId}
          player={player}
        />
      ))}
      <div className="grow" />
    </div>
  );
};

export default PlayerList;
