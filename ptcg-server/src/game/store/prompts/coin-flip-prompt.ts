import { Prompt } from "./prompt";
import { GameMessage } from "../../game-error";

export class CoinFlipPrompt extends Prompt<boolean> {

  readonly type: string = 'Coin flip'

  constructor(playerId: number, public message: GameMessage) {
    super(playerId);
  }

}
