import { CardType } from "../card/card-types";
import { Effect } from "./effect";
import { Player } from "../state/player";
import { PokemonCardList } from "../state/pokemon-card-list";
import { Resistance, Weakness, Attack } from "../card/pokemon-types";

export enum CheckEffects {
  CHECK_HP_EFFECT = 'CHECK_HP_EFFECT',
  CHECK_PRIZES_COUNT_EFFECT = 'CHECK_PRIZE_COUNT_EFFECT',
  CHECK_POKEMON_STATS_EFFECT = 'CHECK_POKEMON_STATS_EFFECT',
  CHECK_POKEMON_TYPE_EFFECT = 'CHECK_POKEMON_TYPE_EFFECT',
  CHECK_RETREAT_COST_EFFECT = 'CHECK_RETREAT_COST_EFFECT',
  CHECK_ATTACK_COST_EFFECT = 'CHECK_ATTACK_COST_EFFECT',
  CHECK_ENOUGH_ENERGY_EFFECT = 'CHECK_ENOUGH_ENERGY_EFFECT'
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

export class CheckRetreatCostEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_RETREAT_COST_EFFECT;
  public preventDefault = false;
  public player: Player;
  public cost: CardType[];

  constructor(player: Player) {
    this.player = player;
    const pokemonCard = player.active.getPokemonCard();
    this.cost = pokemonCard !== undefined ? pokemonCard.retreat : [];
  }
}

export class CheckAttackCostEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_ATTACK_COST_EFFECT;
  public preventDefault = false;
  public player: Player;
  public attack: Attack;
  public cost: CardType[];

  constructor(player: Player, attack: Attack) {
    this.player = player;
    this.attack = attack;
    this.cost = attack.cost;
  }
}

export class CheckEnoughEnergyEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_ENOUGH_ENERGY_EFFECT;
  public preventDefault = false;
  public player: Player;
  public source: PokemonCardList;
  public cost: CardType[];
  public enoughEnergy = false;

  constructor(player: Player, cost: CardType[], source?: PokemonCardList) {
    this.player = player;
    this.source = source === undefined ? player.active : source;
    this.cost = cost;
  }
}