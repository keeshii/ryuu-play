import {CardType} from "./card-types";

export interface Weakness {
  type: CardType;
  value?: number; // when undefined, then it's x2
}

export interface Resistance {
  type: CardType;
  value: number;
}

export interface Attack {
  cost: CardType[];
  damage: number;
  name: string;
  text: string;
}

export enum PowerType {
  POKEBODY,
  POKEPOWER,
  ABILITY
}

export interface Power {
  name: string;
  powerType: PowerType;
  text: string;
  useWhenInPlay?: boolean;
  useFromHand?: boolean;
  useFromDiscard?: boolean;
}
