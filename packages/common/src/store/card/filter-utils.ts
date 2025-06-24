import { Card } from './card';
import { EnergyCard } from './energy-card';
import { PokemonCard } from './pokemon-card';
import { TrainerCard } from './trainer-card';

export type FilterType = Partial<PokemonCard | TrainerCard | EnergyCard>
  | Partial<PokemonCard | TrainerCard | EnergyCard>[];

export class FilterUtils {

  public static match(card: Card, filterType: FilterType): boolean {
    if (!(filterType instanceof Array)) {
      filterType = [filterType];
    }
    for (const filter of filterType) {
      let result = true;
      for (const key in filter) {
        if (Object.prototype.hasOwnProperty.call(filter, key)) {
          const filterValue = (filter as any)[key];
          const cardValue = (card as any)[key];
          if (filterValue instanceof Array && cardValue instanceof Array) {
            result = filterValue.every(item => cardValue.includes(item));
            if (!result) {
              break;
            }
          } else if (filterValue !== cardValue) {
            result = false;
            break;
          }
        }
      }
      if (result) {
        return true;
      }
    }
    return false;
  }

  public static filter<T extends Card>(cards: T[], filterType: FilterType): T[] {
    return cards.filter(c => FilterUtils.match(c, filterType));
  }

  public static count(cards: Card[], filterType: FilterType): number {
    return cards.reduce((sum, c) => FilterUtils.match(c, filterType) ? sum + 1 : sum, 0);
  }

  public static findIndexes(cards: Card[], filterType: FilterType): number[] {
    const indexes: number[] = [];
    for (let i = 0; i < cards.length; i++) {
      if (FilterUtils.match(cards[i], filterType)) {
        indexes.push(i);
      }
    }
    return indexes;
  }

}
