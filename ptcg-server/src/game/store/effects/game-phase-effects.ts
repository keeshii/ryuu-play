import { Effect } from "./effect";
import { Player } from "../state/player";

export enum GamePhaseEffects {
  END_TURN_EFFECT = 'END_TURN_EFFECT',
  WHO_BEGINS_EFFECT = 'WHO_BEGINS_EFFECT',
  BETWEEN_TURNS_EFFECT = 'BETWEEN_TURNS_EFFECT'
}

export class EndTurnEffect implements Effect {
  readonly type: string = GamePhaseEffects.END_TURN_EFFECT;
  public preventDefault = false;
  public player: Player;

  constructor(player: Player) {
    this.player = player;
  }
}

export class WhoBeginsEffect implements Effect {
  readonly type: string = GamePhaseEffects.END_TURN_EFFECT;
  public preventDefault = false;
  public player: Player | undefined;

  constructor() { }
}

export class BetweenTurnsEffect implements Effect {
  readonly type: string = GamePhaseEffects.BETWEEN_TURNS_EFFECT;
  public preventDefault = false;
  public player: Player;
  public poisonDamage: number;
  public burnDamage: number;
  public burnFlipResult: boolean | undefined;
  public asleepFlipResult: boolean | undefined;

  constructor(player: Player) {
    this.player = player;
    this.poisonDamage = player.active.poisonDamage;
    this.burnDamage = player.active.burnDamage;
    this.burnFlipResult = undefined;
    this.asleepFlipResult = undefined;
  }
}
