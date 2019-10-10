import { Player } from "./player";

export enum GamePhase {
  WAITING_FOR_PLAYERS,
  SETUP,
  PLAYER_TURN,
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

  public phase: GamePhase = GamePhase.WAITING_FOR_PLAYERS;

  public turn = 0;

  public activePlayer: number = 0;

  public winner: GameWinner = GameWinner.NONE;

  public players: Player[] = [];

  public benchSize: number = 6;

}
