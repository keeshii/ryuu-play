import { Card } from "../card/card";
import { CardList } from "../state/card-list";
import { EnergyCard } from "../card/energy-card";
import { Prompt } from "./prompt";
import { PokemonCard } from "../card/pokemon-card";
import { TrainerCard } from "../card/trainer-card";

export const ChooseCardsPromptType = 'Choose cards';

export interface ChooseCardsOptions {
  min: number;
  max: number;
  allowCancel: boolean;
  blocked: number[];
  isSecret: boolean;
}

export type FilterType = Partial<PokemonCard | TrainerCard | EnergyCard>;

export class ChooseCardsPrompt extends Prompt<Card[]> {

  readonly type: string = ChooseCardsPromptType;
  
  public options: ChooseCardsOptions;

  constructor(
    playerId: number,
    public message: string,
    public cards: CardList,
    public filter: FilterType,
    options?: Partial<ChooseCardsOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      min: 0,
      max: cards.cards.length,
      allowCancel: true,
      blocked: [],
      isSecret: false
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
    if (result.length < this.options.min || result.length > this.options.max) {
      return false;
    }
    const blocked = this.options.blocked;
    return result.every(r => {
      const index = this.cards.cards.indexOf(r);
      return index !== -1 && !blocked.includes(index) && this.matchesFilter(r);
    });
  }

  private matchesFilter(card: Card): boolean {
    for (const key in this.filter) {
      if (this.filter.hasOwnProperty(key)) {
        if ((this.filter as any)[key] !== (card as any)[key]) {
          return false;
        }
      }
    }
    return true;
  }

}
