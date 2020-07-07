import { Effect } from "./effect";
import { Player } from "../state/player";

export enum GamePhaseEffects {
  END_TURN_EFFECT = 'END_TURN_EFFECT',
}

export class EndTurnEffect implements Effect {
  readonly type: string = GamePhaseEffects.END_TURN_EFFECT;
  public preventDefault = false;
  public player: Player;

  constructor(player: Player) {
    this.player = player;
  }
}
