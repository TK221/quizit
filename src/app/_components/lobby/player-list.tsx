import { type Player } from "~/server/game/game";
import PlayerComponent from "./player";

const PlayerList = (props: {
  lobbyId: string;
  players: Player[];
  isGameMaster: boolean;
}) => {
  return (
    <div className="flex space-x-2">
      {props.players.map((player) => (
        <PlayerComponent
          lobbyId={props.lobbyId}
          key={player.userId}
          player={player}
          isGameMaster={props.isGameMaster}
        />
      ))}
    </div>
  );
};

export default PlayerList;
