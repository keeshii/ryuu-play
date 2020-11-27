import { CardType } from "../card/card-types";
import { Effect } from "./effect";
import { Player } from "../state/player";
import { PokemonCardList } from "../state/pokemon-card-list";
import { Resistance, Weakness, Attack } from "../card/pokemon-types";
import { EnergyMap } from "../prompts/choose-energy-prompt";

export enum CheckEffects {
  CHECK_HP_EFFECT = 'CHECK_HP_EFFECT',
  CHECK_PRIZES_COUNT_EFFECT = 'CHECK_PRIZE_COUNT_EFFECT',
  CHECK_POKEMON_STATS_EFFECT = 'CHECK_POKEMON_STATS_EFFECT',
  CHECK_POKEMON_TYPE_EFFECT = 'CHECK_POKEMON_TYPE_EFFECT',
  CHECK_RETREAT_COST_EFFECT = 'CHECK_RETREAT_COST_EFFECT',
  CHECK_ATTACK_COST_EFFECT = 'CHECK_ATTACK_COST_EFFECT',
  CHECK_ENOUGH_ENERGY_EFFECT = 'CHECK_ENOUGH_ENERGY_EFFECT',
  CHECK_POKEMON_PLAYED_TURN_EFFECT = 'CHECK_POKEMON_PLAYED_TURN_EFFECT',
  CHECK_TABLE_STATE_EFFECT = 'CHECK_TABLE_STATE_EFFECT'
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

export class CheckPokemonPlayedTurnEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_POKEMON_PLAYED_TURN_EFFECT;
  public preventDefault = false;
  public player: Player;
  public target: PokemonCardList;
  public pokemonPlayedTurn: number;

  constructor(player: Player, target: PokemonCardList) {
    this.player = player;
    this.target = target;
    this.pokemonPlayedTurn = target.pokemonPlayedTurn;
  }
}

export class CheckPokemonStatsEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_POKEMON_STATS_EFFECT;
  public preventDefault = false;
  public target: PokemonCardList;
  public weakness: Weakness[];
  public resistance: Resistance[];

  constructor(target: PokemonCardList) {
    this.target = target;
    const pokemonCard = target.getPokemonCard();
    this.weakness = pokemonCard ? [ ...pokemonCard.weakness ] : [];
    this.resistance = pokemonCard ? [ ...pokemonCard.resistance ] : [];
  }
}

export class CheckPokemonTypeEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_POKEMON_TYPE_EFFECT;
  public preventDefault = false;
  public target: PokemonCardList;
  public cardTypes: CardType[];

  constructor(target: PokemonCardList) {
    this.target = target;
    const pokemonCard = target.getPokemonCard();
    this.cardTypes = pokemonCard ? [ pokemonCard.cardType ] : [];
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
    this.cost = pokemonCard !== undefined ? [ ...pokemonCard.retreat ] : [];
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
    this.cost = [ ...attack.cost ];
  }
}

export class CheckProvidedEnergyEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_ENOUGH_ENERGY_EFFECT;
  public preventDefault = false;
  public player: Player;
  public source: PokemonCardList;
  public energyMap: EnergyMap[] = [];

  constructor(player: Player, source?: PokemonCardList) {
    this.player = player;
    this.source = source === undefined ? player.active : source;
  }
}

export class CheckTableStateEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_TABLE_STATE_EFFECT;
  public preventDefault = false;
  public benchSize: number;

  constructor() {
    this.benchSize = 5;
  }
}
