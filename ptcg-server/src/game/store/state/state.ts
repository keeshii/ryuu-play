import { Player } from "./player";
import { Prompt } from "../prompts/prompt";
import { StateLog } from "./state-log";
import { Rules } from "./rules";

export enum GamePhase {
  WAITING_FOR_PLAYERS,
  SETUP,
  PLAYER_TURN,
  ATTACK,
  BETWEEN_TURNS,
  FINISHED
}

export enum GameWinner {
  NONE = -1,
  PLAYER_1 = 0,
  PLAYER_2 = 1,
  DRAW = 3
}

export class State {

  public logs: StateLog[] = [];

  public rules: Rules = new Rules();

  public prompts: Prompt<any>[] = [];

  public phase: GamePhase = GamePhase.WAITING_FOR_PLAYERS;

  public turn = 0;

  public activePlayer: number = 0;

  public winner: GameWinner = GameWinner.NONE;

  public players: Player[] = [];

}
