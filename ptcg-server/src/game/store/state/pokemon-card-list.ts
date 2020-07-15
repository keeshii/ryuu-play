import { CardList } from "./card-list";
import { CardMarker } from "./card-marker";
import { SpecialCondition } from "../card/card-types";
import { PokemonCard } from "../card/pokemon-card";

export class PokemonCardList extends CardList {

  public damage: number = 0;

  public specialConditions: SpecialCondition[] = [];

  public markers: CardMarker[] = [];

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

  clearEffects(): void {
    this.damage = 0;
    this.specialConditions = [];
  }

}
