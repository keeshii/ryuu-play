import { Card } from "../card/card";
import { CardList } from "../state/card-list";
import { CardType, SuperType } from "../card/card-types";
import { Prompt } from "./prompt";
import {StateUtils} from "../state-utils";

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

  public decode(result: number[] | null): Card[] | null {
    if (result === null) {
      return null;
    }
    const cards: Card[] = this.cards.cards;
    return result.map(index => cards[index]);
  }

  public validate(result: Card[] | null): boolean {
    if (result === null) {
      return this.options.allowCancel;
    }
    if (!result.every(c => c.superType === SuperType.ENERGY)) {
      return false;
    }
    if (!StateUtils.checkExactEnergy(result, this.cost)) {
      return false;
    }
    return true;
  }

}
