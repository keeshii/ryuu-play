import { Player } from "./player";

export enum GamePhase {
  WAITING_FOR_PLAYERS,
  SETUP,
  PLAYER_TURN,
  BETWEEN_TURNS
}

export class State {

  public phase: GamePhase = GamePhase.WAITING_FOR_PLAYERS;

  public turn = 0;
  
  public players: Player[] = [];

  public benchSize: number = 6;

}
