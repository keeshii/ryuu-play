import { State, GameWinner } from "../store/state/state";
import { ReplayPlayer } from "./replay-player";
import { GameError, GameMessage } from "../game-error";
import { SerializedState } from "../serializer/serializer.interface";
import { StateSerializer } from "../serializer/state-serializer";

export class Replay {

  public player1: ReplayPlayer;
  public player2: ReplayPlayer;
  public winner: GameWinner;
  public created: number;
  private turnMap: number[] = [];
  private states: SerializedState[] = [];
  private baseState: State | undefined;
  private serializer = new StateSerializer();

  constructor() {
    this.player1 = { name: '', userId: 0, ranking: 0 };
    this.player2 = { name: '', userId: 0, ranking: 0 };
    this.winner = GameWinner.NONE;
    this.created = 0;
  }

  public getStateCount(): number {
    return this.states.length;
  }

  public getState(position: number): State {
    if (position < 0 || position >= this.states.length) {
      throw new GameError(GameMessage.REPLAY_INVALID_STATE);
    }
    if (this.baseState === undefined) {
      this.baseState = this.serializer.deserialize(this.states[position]);
    }
    if (position === 0) {
      return this.baseState;
    }
    return this.serializer.deserializeDiff(this.baseState, this.states[position]);
  }

  public getTurnCount(): number {
    return this.turnMap.length;
  }

  public getTurnPosition(turn: number): number {
    if (turn < 0 || turn >= this.turnMap.length) {
      throw new GameError(GameMessage.REPLAY_INVALID_STATE);
    }
    return this.turnMap[turn];
  }

  public setCreated(created: number): void {
    this.created = created;
  }

  public appendState(state: State): void {
    const serialized = this.baseState === undefined
      ? this.serializer.serialize(state)
      : this.serializer.serializeDiff(this.baseState, state);
    this.baseState = state;
    this.states.push(serialized);
    while (this.turnMap.length <= state.turn) {
      this.turnMap.push(this.states.length - 1);
    }
  }

  public serialize(): string {
    const json = {
      player1: this.player1,
      player2: this.player2,
      winner: this.winner,
      created: this.created,
      turnMap: this.turnMap,
      states: this.states
    };
    return JSON.stringify(json);
  }

  public deserialize(replayData: string): void {
    try {
      const data = JSON.parse(replayData);
      this.player1 = data.player1;
      this.player2 = data.player2;
      this.winner = data.winner;
      this.created = data.created;
      this.turnMap = data.turnMap;
      this.states = data.states;
      this.baseState = undefined;
    } catch (error) {
      throw new GameError(GameMessage.REPLAY_INVALID_STATE);
    }
  }

}
