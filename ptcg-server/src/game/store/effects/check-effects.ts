import { Effect } from "./effect";
import { Player } from "../state/player";
import { PokemonCardList } from "../state/pokemon-card-list";

export enum CheckEffects {
  CHECK_HP_EFFECT = 'CHECK_HP_EFFECT',
  CHECK_PRIZES_COUNT_EFFECT = 'CHECK_PRIZE_COUNT_EFFECT',
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

export class CheckPrizesCountEffect implements Effect {
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
