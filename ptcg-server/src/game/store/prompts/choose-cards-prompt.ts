import { Card } from "../state/card";
import { CardList } from "../state/card-list";
import { Player } from "../state/player";
import { Prompt } from "./prompt";
import { StoreMessage } from "../store-messages";

export interface ChooseCardsOptions {
  min: number;
  max: number;
  allowCancel: boolean;
}

export class ChooseCardsPrompt extends Prompt<boolean> {

  readonly type: string = 'Choose cards'

  constructor(
    player: Player,
    public message: StoreMessage,
    public cards: CardList,
    public filter: Partial<Card>,
    public options: ChooseCardsOptions
  ) {
    super(player);
  }

}
