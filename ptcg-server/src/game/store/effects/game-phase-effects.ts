import { Effect } from "./effect";
import { Player } from "../state/player";
import { GameWinner } from "../state/state";

export enum GamePhaseEffects {
  END_TURN_EFFECT = 'END_TURN_EFFECT',
  END_GAME_EFFECT = 'END_GAME_EFFECT',
}

export class EndTurnEffect implements Effect {
  readonly type: string = GamePhaseEffects.END_TURN_EFFECT;
  public preventDefault = false;
  public player: Player;

  constructor(player: Player) {
    this.player = player;
  }
}

export class EndGameEffect implements Effect {
  readonly type: string = GamePhaseEffects.END_GAME_EFFECT;
  public preventDefault = false;
  public winner: GameWinner;

  constructor(winner: GameWinner) {
    this.winner = winner;
  }
}
