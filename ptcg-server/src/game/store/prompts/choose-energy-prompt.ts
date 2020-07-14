import { Card } from "../card/card";
import { CardList } from "../state/card-list";
import { CardType } from "../card/card-types";
import { Prompt } from "./prompt";

export const ChooseEnergyPromptType = 'Choose energy';

export interface ChooseEnergyOptions {
  allowCancel: boolean;
}

export class ChooseEnergyPrompt extends Prompt<Card[]> {

  readonly type: string = ChooseEnergyPromptType;

  public options: ChooseEnergyOptions;

  constructor(
    playerId: number,
    public message: string,
    public cards: CardList,
    public cost: CardType[],
    options?: Partial<ChooseEnergyOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: true
    }, options);
  }

}
