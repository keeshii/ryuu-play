import { Card } from "../card/card";
import { CardList } from "../state/card-list";
import { Prompt } from "./prompt";
import { GameMessage } from "../../game-error";

export interface ChooseCardsOptions {
  min: number;
  max: number;
  allowCancel: boolean;
}

export class ChooseCardsPrompt extends Prompt<Card[]> {

  readonly type: string = 'Choose cards'
  
  public options: ChooseCardsOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public cards: CardList,
    public filter: Partial<Card>,
    options?: Partial<ChooseCardsOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      min: 0,
      max: cards.cards.length,
      allowCancel: true
    }, options);
  }

}
