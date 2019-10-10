import { Player } from "../state/player";
import { Prompt } from "./prompt";

export class ShuffleDeckPrompt extends Prompt<number[]> {

  readonly type: string = 'Shuffle deck'

  constructor(player: Player) {
    super(player);
  }

}
