import { Attack, Power } from "../card/pokemon-types";
import { Effect } from "./effect";
import { Player } from "../state/player";
import { PokemonCard } from "../card/pokemon-card";
import { PokemonCardList } from "../state/pokemon-card-list";
import { Card } from "../card/card";

export enum GameEffects {
  RETREAT_EFFECT = 'RETREAT_EFFECT',
  USE_ATTACK_EFFECT = 'USE_ATTACK_EFFECT',
  USE_STADIUM_EFFECT = 'USE_STADIUM_EFFECT',
  USE_POWER_EFFECT = 'USE_POWER_EFFECT',
  POWER_EFFECT = 'POWER_EFFECT',
  ATTACK_EFFECT = 'ATTACK_EFFECT',
  KNOCK_OUT_EFFECT = 'KNOCK_OUT_EFFECT',
  HEAL_EFFECT = 'HEAL_EFFECT',
  EVOLVE_EFFECT = 'EVOLVE_EFFECT'
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
  public card: PokemonCard;

  constructor(player: Player, power: Power, card: PokemonCard) {
    this.player = player;
    this.power = power;
    this.card = card;
  }
}

export class PowerEffect implements Effect {
  readonly type: string = GameEffects.POWER_EFFECT;
  public preventDefault = false;
  public player: Player;
  public power: Power;
  public card: PokemonCard;

  constructor(player: Player, power: Power, card: PokemonCard) {
    this.player = player;
    this.power = power;
    this.card = card;
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

export class UseStadiumEffect implements Effect {
  readonly type: string = GameEffects.USE_STADIUM_EFFECT;
  public preventDefault = false;
  public player: Player;
  public stadium: Card;

  constructor(player: Player, stadium: Card) {
    this.player = player;
    this.stadium = stadium;
  }
}

export class AttackEffect implements Effect {
  readonly type: string = GameEffects.ATTACK_EFFECT;
  public preventDefault = false;
  public player: Player;
  public opponent: Player;
  public attack: Attack;
  public damage: number;
  public ignoreWeakness = false;
  public ignoreResistance = false;

  constructor(player: Player, opponent: Player, attack: Attack) {
    this.player = player;
    this.opponent = opponent;
    this.attack = attack;
    this.damage = attack.damage;
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

export class EvolveEffect implements Effect {
  readonly type: string = GameEffects.EVOLVE_EFFECT;
  public preventDefault = false;
  public player: Player;
  public target: PokemonCardList;
  public pokemonCard: PokemonCard;

  constructor(player: Player, target: PokemonCardList, pokemonCard: PokemonCard) {
    this.player = player;
    this.target = target;
    this.pokemonCard = pokemonCard;
  }
}
