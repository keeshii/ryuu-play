import { CardList } from "../state/card-list";
import { Player } from "../state/player";
import { Prompt } from "./prompt";

export class ShuffleDeckPrompt extends Prompt<CardList> {

  readonly type: string = 'Shuffle deck'

  constructor(player: Player) {
    super(player);
  }

}
