import { Prompt } from "./prompt";

export class ShuffleDeckPrompt extends Prompt<number[]> {

  readonly type: string = 'Shuffle deck'

  constructor(playerId: number) {
    super(playerId);
  }

}
