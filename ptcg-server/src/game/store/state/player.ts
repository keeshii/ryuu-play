import { CardList } from "./card-list";
import { CardTarget, PlayerType, SlotType } from "../actions/play-card-action";
import { PokemonCard } from "../card/pokemon-card";
import { PokemonCardList } from "./pokemon-card-list";
import { Marker } from "./card-marker";

export class Player {

  id: number = 0;

  name: string = '';

  deck: CardList = new CardList();

  hand: CardList = new CardList();

  discard: CardList = new CardList();

  stadium: CardList = new CardList();

  active: PokemonCardList = new PokemonCardList();

  bench: PokemonCardList[] = [];

  prizes: CardList[] = [];

  retreatedTurn: number = 0;

  energyPlayedTurn: number = 0;

  supporterPlayedTurn: number = 0;
  
  stadiumPlayedTurn: number = 0;

  stadiumUsedTurn: number = 0;

  marker = new Marker();

  avatarName: string = '';

  getPrizeLeft(): number {
    return this.prizes.reduce((left, p) => left + p.cards.length, 0);
  }

  forEachPokemon(
    player: PlayerType,
    handler: (cardList: PokemonCardList, pokemonCard: PokemonCard, target: CardTarget) => void
  ): void {
    let pokemonCard = this.active.getPokemonCard();
    let target: CardTarget;

    if (pokemonCard !== undefined) {
      target = { player, slot: SlotType.ACTIVE, index: 0 };
      handler(this.active, pokemonCard, target);
    }

    for (let i = 0; i < this.bench.length; i++) {
      pokemonCard = this.bench[i].getPokemonCard();
      if (pokemonCard !== undefined) {
        target = { player, slot: SlotType.BENCH, index: i };
        handler(this.bench[i], pokemonCard, target);
      }
    }
  }

  switchPokemon(target: PokemonCardList) {
    const benchIndex = this.bench.indexOf(target);
    if (benchIndex !== -1) {
      this.active.clearEffects();
      const temp = this.active;
      this.active = this.bench[benchIndex];
      this.bench[benchIndex] = temp;
    }
  }

}
