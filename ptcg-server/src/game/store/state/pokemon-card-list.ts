import { CardList } from "./card-list";
import { SpecialCondition } from "../card/card-types";
import { PokemonCard } from "../card/pokemon-card";

export class PokemonCardList extends CardList {

  public damage: number = 0;

  public specialConditions: SpecialCondition[] = [];

  public getPokemonCard(): PokemonCard | undefined {
    let result: PokemonCard | undefined;
    for (let card of this.cards) {
      if (card instanceof PokemonCard) {
        if (result === undefined || result.stage < card.stage) {
          result = card;
        }
      }
    }
    return result;
  }

}
