import { Prompt } from "./prompt";

export class CoinFlipPrompt extends Prompt<boolean> {

  readonly type: string = 'Coin flip'

  constructor(playerId: number, public message: string) {
    super(playerId);
  }

}
