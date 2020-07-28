import { Attack, Power } from "../card/pokemon-types";
import { Effect } from "./effect";
import { Player } from "../state/player";
import { PokemonCardList } from "../state/pokemon-card-list";

export enum GameEffects {
  RETREAT_EFFECT = 'RETREAT_EFFECT',
  USE_ATTACK_EFFECT = 'USE_ATTACK_EFFECT',
  USE_POWER_EFFECT = 'USE_POWER_EFFECT',
  POWER_EFFECT = 'POWER_EFFECT',
  DEAL_DAMAGE_EFFECT = 'DEAL_DAMAGE_EFFECT',
  ATTACK_EFFECT = 'ATTACK_EFFECT',
  KNOCK_OUT_EFFECT = 'KNOCK_OUT_EFFECT',
  HEAL_EFFECT = 'HEAL_EFFECT',
  APPLY_WEAKNESS_EFFECT = 'APPLY_WEAKNESS_EFFECT'
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

export class UsePowerEffect implements Effect {
  readonly type: string = GameEffects.USE_POWER_EFFECT;
  public preventDefault = false;
  public player: Player;
  public power: Power;

  constructor(player: Player, power: Power) {
    this.player = player;
    this.power = power;
  }
}

export class PowerEffect implements Effect {
  readonly type: string = GameEffects.POWER_EFFECT;
  public preventDefault = false;
  public player: Player;
  public power: Power;

  constructor(player: Player, power: Power) {
    this.player = player;
    this.power = power;
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
  public attack: Attack;
  public target: PokemonCardList;
  public source: PokemonCardList;

  constructor(player: Player, damage: number, attack: Attack, target: PokemonCardList, source: PokemonCardList) {
    this.player = player;
    this.damage = damage;
    this.attack = attack;
    this.target = target;
    this.source = source;
  }
}

export class DealDamageAfterWeaknessEffect implements Effect {
  readonly type: string = GameEffects.DEAL_DAMAGE_EFFECT;
  public preventDefault = false;
  public player: Player;
  public damage: number;
  public attack: Attack;
  public target: PokemonCardList;
  public source: PokemonCardList;

  constructor(player: Player, damage: number, attack: Attack, target: PokemonCardList, source: PokemonCardList) {
    this.player = player;
    this.damage = damage;
    this.attack = attack;
    this.target = target;
    this.source = source;
  }
}

export class AttackEffect implements Effect {
  readonly type: string = GameEffects.ATTACK_EFFECT;
  public preventDefault = false;
  public player: Player;
  public source: PokemonCardList;
  public attack: Attack;
  public damage: number;

  constructor(player: Player, attack: Attack, source?: PokemonCardList) {
    this.player = player;
    this.source = source || player.active;
    this.attack = attack;
    this.damage = attack.damage;
  }
}

export class ApplyWeaknessEffect implements Effect {
  readonly type: string = GameEffects.APPLY_WEAKNESS_EFFECT;
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

// how many prizes when target Pokemon is KO
export class KnockOutEffect implements Effect {
  readonly type: string = GameEffects.KNOCK_OUT_EFFECT;
  public preventDefault = false;
  public player: Player;
  public target: PokemonCardList;
  public prizeCount: number;

  constructor(player: Player, target: PokemonCardList) {
    this.player = player;
    this.target = target;
    this.prizeCount = 1;
  }
}

export class HealEffect implements Effect {
  readonly type: string = GameEffects.HEAL_EFFECT;
  public preventDefault = false;
  public player: Player;
  public target: PokemonCardList;
  public damage: number;

  constructor(player: Player, target: PokemonCardList, damage: number) {
    this.player = player;
    this.target = target;
    this.damage = damage;
  }
}
