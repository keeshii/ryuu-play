import { Card } from '../card/card';
import { CardList } from '../state/card-list';
import { EnergyCard } from '../card/energy-card';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { PokemonCard } from '../card/pokemon-card';
import { TrainerCard } from '../card/trainer-card';
import { CardType, SuperType } from '../card/card-types';

export const ChooseCardsPromptType = 'Choose cards';

export interface ChooseCardsOptions {
  min: number;
  max: number;
  allowCancel: boolean;
  blocked: number[];
  isSecret: boolean;
  differentTypes: boolean;
  maxPokemons: number | undefined;
  maxEnergies: number | undefined;
  maxTrainers: number | undefined;
}

export type FilterType = Partial<PokemonCard | TrainerCard | EnergyCard>;

export class ChooseCardsPrompt extends Prompt<Card[]> {

  readonly type: string = ChooseCardsPromptType;
  
  public options: ChooseCardsOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
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
      isSecret: false,
      differentTypes: false,
      maxPokemons: undefined,
      maxEnergies: undefined,
      maxTrainers: undefined
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

    // Check if 'different types' restriction is valid
    if (this.options.differentTypes) {
      const typeMap: {[key: number]: boolean} = {};
      for (const card of result) {
        const cardType = ChooseCardsPrompt.getCardType(card);
        if (typeMap[cardType] === true) {
          return false;
        } else {
          typeMap[cardType] = true;
        }
      }
    }

    // Check if 'max' restrictions are valid
    const countMap: {[key: number]: number} = {};
    for (const card of result) {
      const count = countMap[card.superType] || 0;
      countMap[card.superType] = count + 1;
    }
    const { maxPokemons, maxEnergies, maxTrainers } = this.options;
    if ((maxPokemons !== undefined && maxPokemons < countMap[SuperType.POKEMON])
      || (maxEnergies !== undefined && maxEnergies < countMap[SuperType.ENERGY])
      || (maxTrainers !== undefined && maxTrainers < countMap[SuperType.TRAINER])) {
      return false;
    }

    const blocked = this.options.blocked;
    return result.every(r => {
      const index = this.cards.cards.indexOf(r);
      return index !== -1 && !blocked.includes(index) && this.matchesFilter(r);
    });
  }

  public static getCardType(card: Card): CardType {
    if (card.superType === SuperType.ENERGY) {
      const energyCard = card as EnergyCard;
      return energyCard.provides.length > 0 ? energyCard.provides[0] : CardType.NONE;
    }
    if (card.superType === SuperType.POKEMON) {
      const pokemonCard = card as PokemonCard;
      return pokemonCard.cardType;
    }
    return CardType.NONE;
  }

  private matchesFilter(card: Card): boolean {
    for (const key in this.filter) {
      if (Object.prototype.hasOwnProperty.call(this.filter, key)) {
        if ((this.filter as any)[key] !== (card as any)[key]) {
          return false;
        }
      }
    }
    return true;
  }

}
