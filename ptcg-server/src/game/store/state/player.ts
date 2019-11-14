import {CardList} from "./card-list";

export class Player {

  name: string = '';

  deck: CardList = new CardList();

  hand: CardList = new CardList();

  discard: CardList = new CardList();

  stadium: CardList = new CardList();

  active: CardList = new CardList();

  bench: CardList[] = [];

  prizes: CardList = new CardList();

  energyPlayedTurn: number = 0;

  supporterPlayedTurn: number = 0;
  
  stadiumPlayedTurn: number = 0;

  stadiumUsedTurn: number = 0;

}
