import { CardList } from "./card-list";
import { Marker } from "./card-marker";
import { SpecialCondition } from "../card/card-types";
import { PokemonCard } from "../card/pokemon-card";
import { Card } from "../card/card";

export class PokemonCardList extends CardList {

  public damage: number = 0;

  public specialConditions: SpecialCondition[] = [];

  public marker = new Marker();

  // Some pokemon cards can be attached as a tool,
  // we must remember, which card acts as a pokemon tool.
  public tool: Card | undefined;

  public getPokemonCard(): PokemonCard | undefined {
    let result: PokemonCard | undefined;
    for (let card of this.cards) {
      if (card instanceof PokemonCard && card !== this.tool) {
        if (result === undefined || result.stage < card.stage) {
          result = card;
        }
      }
    }
    return result;
  }

  clearEffects(): void {
    this.marker.markers = [];
    this.specialConditions = [];
    if (this.cards.length === 0) {
      this.damage = 0;
    }
    if (this.tool && !this.cards.includes(this.tool)) {
      this.tool = undefined;
    }
  }

  removeSpecialCondition(sp: SpecialCondition): void {
    if (!this.specialConditions.includes(sp)) {
      return;
    }
    this.specialConditions = this.specialConditions
      .filter(s => s !== sp);
  }

  addSpecialCondition(sp: SpecialCondition): void {
    if (this.specialConditions.includes(sp)) {
      return;
    }
    if (sp === SpecialCondition.POISONED || sp === SpecialCondition.BURNED) {
      this.specialConditions.push(sp);
      return;
    }
    this.specialConditions = this.specialConditions.filter(s => [
      SpecialCondition.PARALYZED,
      SpecialCondition.CONFUSED,
      SpecialCondition.ASLEEP
    ].includes(s) === false);
    this.specialConditions.push(sp);
  }

}
