import { CardList } from './card-list';
import { Marker } from './card-marker';
import { SpecialCondition, Stage, TrainerType } from '../card/card-types';
import { EnergyCard } from '../card/energy-card';
import { PokemonCard } from '../card/pokemon-card';
import { TrainerCard } from '../card/trainer-card';
import { Card } from '../card/card';

export class PokemonSlot {

  public damage: number = 0;

  public specialConditions: SpecialCondition[] = [];

  public poisonDamage: number = 10;

  public burnDamage: number = 20;

  public marker = new Marker();

  public pokemonPlayedTurn: number = 0;

  public pokemons: CardList<PokemonCard> = new CardList<PokemonCard>();
  
  public energies: CardList<EnergyCard> = new CardList<EnergyCard>();

  public trainers: CardList<TrainerCard> = new CardList<TrainerCard>();

  public getPokemons(): PokemonCard[] {
    return this.pokemons.cards;
  }

  public getTools(): TrainerCard[] {
    return this.trainers.cards.filter(t => t.trainerType === TrainerType.TOOL);
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

  public isEvolved(): boolean {
    const pokemons = this.getPokemons();
    if (pokemons.length === 0) {
      return false;
    }
    return pokemons.length > 1
      || pokemons[0].stage === Stage.STAGE_1
      || pokemons[0].stage === Stage.STAGE_2;
  }

  public moveTo(destination: CardList): void {
    this.pokemons.moveTo(destination);
    this.energies.moveTo(destination);
    this.trainers.moveTo(destination);
  }

  public moveCardsTo(cards: Card[], destination: CardList): void {
    this.pokemons.moveCardsTo(cards as PokemonCard[], destination);
    this.energies.moveCardsTo(cards as EnergyCard[], destination);
    this.trainers.moveCardsTo(cards as TrainerCard[], destination);
  }

  public moveCardTo(card: Card, destination: CardList): void {
    this.moveCardsTo([card], destination);
  }

  public moveToTop(destination: CardList): void {
    this.trainers.moveToTop(destination);
    this.energies.moveToTop(destination);
    this.pokemons.moveToTop(destination);
  }

  public moveCardsToTop(cards: Card[], destination: CardList): void {
    this.trainers.moveCardsToTop(cards as TrainerCard[], destination);
    this.energies.moveCardsToTop(cards as EnergyCard[], destination);
    this.pokemons.moveCardsToTop(cards as PokemonCard[], destination);
  }

  public moveCardToTop(card: Card, destination: CardList): void {
    this.moveCardsToTop([card], destination);
  }

  clearEffects(): void {
    this.marker.markers = [];
    this.specialConditions = [];
    this.poisonDamage = 10;
    this.burnDamage = 20;
    if (this.pokemons.cards.length === 0) {
      this.damage = 0;
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
