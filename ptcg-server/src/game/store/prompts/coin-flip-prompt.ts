import { Player } from "../state/player";
import { Prompt } from "./prompt";
import { StoreMessage } from "../store-messages";

export class CoinFlipPrompt extends Prompt<boolean> {

  readonly type: string = 'Coin flip'

  constructor(player: Player, public message: StoreMessage) {
    super(player);
  }

}
