import { Card } from '../store/card/card';

export type SerializedState = string;

export interface SerializerContext {
  cards: Card[];
}

export interface Serialized {
  _type: string;
  [x: string]: any;
}

export interface Serializer<T extends Object> {
  types: string[];
  classes: any[];
  serialize(state: T): Serialized;
  deserialize(data: Serialized, context: SerializerContext): T;
}
