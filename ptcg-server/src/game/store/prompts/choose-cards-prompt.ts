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

export class ChooseCardsPrompt extends Prompt<Card[]> {

  readonly type: string = 'Choose cards'
  
  public options: ChooseCardsOptions;

  constructor(
    player: Player,
    public message: StoreMessage,
    public cards: CardList,
    public filter: Partial<Card>,
    options?: Partial<ChooseCardsOptions>
  ) {
    super(player);

    // Default options
    this.options = Object.assign({}, {
      min: 0,
      max: cards.cards.length,
      allowCancel: true
    }, options);
  }

}
