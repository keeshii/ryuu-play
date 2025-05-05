import { CardList } from './card-list';
import { Marker } from './card-marker';
import { SpecialCondition, Stage, SuperType } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { Card } from '../card/card';

export class PokemonCardList extends CardList {

  public damage: number = 0;

  public specialConditions: SpecialCondition[] = [];

  public poisonDamage: number = 10;

  public burnDamage: number = 20;

  public marker = new Marker();

  public pokemonPlayedTurn: number = 0;

  // Some pokemon cards can be attached as a tool,
  // we must remember, which card acts as a pokemon tool.
  public tool: Card | undefined;

  public getPokemons(): PokemonCard[] {
    const result: PokemonCard[] = [];
    for (const card of this.cards) {
      if (card.superType === SuperType.POKEMON && card !== this.tool) {
        result.push(card as PokemonCard);
      }
    }
    return result;
  }

  public getPokemonCard(): PokemonCard | undefined {
    const pokemons = this.getPokemons();
    if (pokemons.length > 0) {
      return pokemons[pokemons.length - 1];
    }
  }

  public isBasic(): boolean {
    const pokemons = this.getPokemons();
    if (pokemons.length !== 1) {
      return false;
    }
    return pokemons[0].stage === Stage.BASIC;
  }

  clearEffects(): void {
    this.marker.markers = [];
    this.specialConditions = [];
    this.poisonDamage = 10;
    this.burnDamage = 20;
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
    if (sp === SpecialCondition.POISONED) {
      this.poisonDamage = 10;
    }
    if (sp === SpecialCondition.BURNED) {
      this.burnDamage = 20;
    }
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
