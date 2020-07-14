import { CardType } from "../card/card-types";
import { Effect } from "./effect";
import { Player } from "../state/player";
import { PokemonCardList } from "../state/pokemon-card-list";
import { Resistance, Weakness } from "../card/pokemon-types";

export enum CheckEffects {
  CHECK_HP_EFFECT = 'CHECK_HP_EFFECT',
  CHECK_PRIZES_COUNT_EFFECT = 'CHECK_PRIZE_COUNT_EFFECT',
  CHECK_POKEMON_STATS_EFFECT = 'CHECK_POKEMON_STATS_EFFECT',
  CHECK_POKEMON_TYPE_EFFECT = 'CHECK_POKEMON_TYPE_EFFECT'
}

export class CheckHpEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_HP_EFFECT;
  public preventDefault = false;
  public player: Player;
  public target: PokemonCardList;
  public hp: number;

  constructor(player: Player, target: PokemonCardList) {
    this.player = player;
    this.target = target;
    const pokemonCard = target.getPokemonCard();
    this.hp = pokemonCard ? pokemonCard.hp : 0;
  }
}

// how many prizes when target Pokemon is KO
export class CheckPokemonPrizesEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_PRIZES_COUNT_EFFECT;
  public preventDefault = false;
  public player: Player;
  public target: PokemonCardList;
  public count: number;

  constructor(player: Player, target: PokemonCardList) {
    this.player = player;
    this.target = target;
    this.count = 1;
  }
}

export class CheckPokemonStatsEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_POKEMON_STATS_EFFECT;
  public preventDefault = false;
  public target: PokemonCardList;
  public weakness: Weakness[];
  public resistance: Resistance[];
  public retreat: CardType[]; 

  constructor(target: PokemonCardList) {
    this.target = target;
    const pokemonCard = target.getPokemonCard();
    this.weakness = pokemonCard ? pokemonCard.weakness : [];
    this.resistance = pokemonCard ? pokemonCard.resistance : [];
    this.retreat = pokemonCard ? pokemonCard.retreat : [];
  }
}

export class CheckPokemonTypeEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_POKEMON_TYPE_EFFECT;
  public preventDefault = false;
  public target: PokemonCardList;
  public cardType: CardType;

  constructor(target: PokemonCardList) {
    this.target = target;
    const pokemonCard = target.getPokemonCard();
    this.cardType = pokemonCard ? pokemonCard.cardType : CardType.NONE;
  }
}
