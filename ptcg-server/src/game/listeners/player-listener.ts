import { Card } from '../core/card';

export interface PlayerListener {

  onChooseStartingPokemons(hand: Card[]): Promise<Card[]>;

}
