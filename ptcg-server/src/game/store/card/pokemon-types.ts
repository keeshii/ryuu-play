import {CardType} from "./card-types";

export interface Weakness {
  types: CardType[];
  value?: number; // when undefined, then it's x2
}

export interface Resistance {
  types: CardType[];
  value: number;
}

export interface Attack {
  cost: CardType[];
  damage: number;
  name: string;
}

export enum PowerType {
  POKEBODY,
  POKEPOWER,
  ABILITY
}

export interface Power {
  name: string,
  powerType: PowerType
}
