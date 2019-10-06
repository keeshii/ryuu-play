import {Prompt} from "./prompt";
import {CardList} from "../state/card-list";

export class ShufflePrompt extends Prompt<CardList> {

  readonly type: string = 'Shuffle'

  constructor(public cards: CardList) {
    super();
  }

}
