import { Attack } from "../card/pokemon-types";
import { CardType } from "../card/card-types";
import { Effect } from "./effect";
import { Player } from "../state/player";
import { PokemonCardList } from "../state/pokemon-card-list";

export enum GameEffects {
  RETREAT_EFFECT = 'RETREAT_EFFECT',
  USE_ATTACK_EFFECT = 'USE_ATTACK_EFFECT',
  DEAL_DAMAGE_EFFECT = 'DEAL_DAMAGE_EFFECT',
  CHECK_ENOUGH_ENERGY_EFFECT = 'CHECK_ENOUGH_ENERGY_EFFECT',
  CHECK_ATTACK_COST_EFFECT = 'CHECK_ATTACK_COST_EFFECT',
  CHECK_RETREAT_COST_EFFECT = 'CHECK_RETREAT_COST_EFFECT',
  ATTACK_EFFECT = 'ATTACK_EFFECT'
}

export class RetreatEffect implements Effect {
  readonly type: string = GameEffects.RETREAT_EFFECT;
  public preventDefault = false;
  public player: Player;
  public benchIndex: number;

  constructor(player: Player, benchIndex: number) {
    this.player = player;
    this.benchIndex = benchIndex;
  }
}

export class UseAttackEffect implements Effect {
  readonly type: string = GameEffects.USE_ATTACK_EFFECT;
  public preventDefault = false;
  public player: Player;
  public attack: Attack;

  constructor(player: Player, attack: Attack) {
    this.player = player;
    this.attack = attack;
  }
}

export class DealDamageEffect implements Effect {
  readonly type: string = GameEffects.DEAL_DAMAGE_EFFECT;
  public preventDefault = false;
  public player: Player;
  public damage: number;
  public target: PokemonCardList;
  public source: PokemonCardList;

  constructor(player: Player, damage: number, target: PokemonCardList, source: PokemonCardList) {
    this.player = player;
    this.damage = damage;
    this.target = target;
    this.source = source;
  }
}

export class DealDamageAfterWeaknessEffect implements Effect {
  readonly type: string = GameEffects.DEAL_DAMAGE_EFFECT;
  public preventDefault = false;
  public player: Player;
  public damage: number;
  public target: PokemonCardList;
  public source: PokemonCardList;

  constructor(player: Player, damage: number, target: PokemonCardList, source: PokemonCardList) {
    this.player = player;
    this.damage = damage;
    this.target = target;
    this.source = source;
  }
}

export class CheckRetreatCostEffect implements Effect {
  readonly type: string = GameEffects.CHECK_RETREAT_COST_EFFECT;
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
  readonly type: string = GameEffects.CHECK_ATTACK_COST_EFFECT;
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
  readonly type: string = GameEffects.CHECK_ENOUGH_ENERGY_EFFECT;
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

export class AttackEffect implements Effect {
  readonly type: string = GameEffects.ATTACK_EFFECT;
  public preventDefault = false;
  public player: Player;
  public attack: Attack;

  constructor(player: Player, attack: Attack) {
    this.player = player;
    this.attack = attack;
  }
}
