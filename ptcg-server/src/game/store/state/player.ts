import { CardList } from "./card-list";
import { PokemonCardList } from "./pokemon-card-list";

export class Player {

  id: number = 0;

  name: string = '';

  deck: CardList = new CardList();

  hand: CardList = new CardList();

  discard: CardList = new CardList();

  stadium: CardList = new CardList();

  active: PokemonCardList = new PokemonCardList();

  bench: PokemonCardList[] = [];

  prizes: CardList = new CardList();

  energyPlayedTurn: number = 0;

  supporterPlayedTurn: number = 0;
  
  stadiumPlayedTurn: number = 0;

  stadiumUsedTurn: number = 0;

}
