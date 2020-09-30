import { State, GameError, GameMessage, Player } from "../../game";
import { SimpleBotOptions } from "../simple-bot-options";

export abstract class SimpleScore {

  constructor(protected options: SimpleBotOptions) { }

  public abstract getScore(state: State, playerId: number): number;

  protected getPlayer(state: State, playerId: number): Player {
    const player = state.players.find(p => p.id === playerId);
    if (player === undefined) {
      throw new GameError(GameMessage.INVALID_GAME_STATE);
    }
    return player;
  }

}
