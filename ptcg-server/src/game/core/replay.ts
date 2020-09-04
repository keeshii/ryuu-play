import { gzip, ungzip } from 'pako';

import { State, GameWinner } from "../store/state/state";
import { ReplayPlayer, ReplayOptions } from "./replay.interface";
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
  private diffs: SerializedState[] = [];
  private prevState: SerializedState | undefined;
  private serializer = new StateSerializer();
  private options: ReplayOptions;

  constructor(options: Partial<ReplayOptions> = {}) {
    this.player1 = { name: '', userId: 0, ranking: 0 };
    this.player2 = { name: '', userId: 0, ranking: 0 };
    this.winner = GameWinner.NONE;
    this.created = 0;
    this.options = Object.assign({
      readStates: true,
      writeStates: true
    }, options);
  }

  public getStateCount(): number {
    return this.states.length;
  }

  public getState(position: number): State {
    if (position < 0 || position >= this.states.length) {
      throw new GameError(GameMessage.REPLAY_INVALID_STATE);
    }
    return this.serializer.deserialize(this.states[position]);
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
    const full = this.serializer.serialize(state);
    let diff = this.serializer.serializeDiff(this.prevState, state);
    this.prevState = full;
    this.diffs.push(diff);
    this.states.push(full);
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
      states: this.swapQuotes(this.diffs)
    };
    return this.compress(JSON.stringify(json));
  }

  public deserialize(replayData: string): void {
    try {
      const data = JSON.parse(this.decompress(replayData));
      this.player1 = data.player1;
      this.player2 = data.player2;
      this.winner = data.winner;
      this.created = data.created;
      if (this.options.readStates) {
        this.turnMap = data.turnMap;
        this.diffs = this.swapQuotes(data.states);
        this.states = this.restoreStates(this.diffs);
        this.prevState = this.states.length > 0
          ? this.states[this.states.length - 1]
          : undefined;
      }
    } catch (error) {
      throw new GameError(GameMessage.REPLAY_INVALID_STATE);
    }
  }

  private swapQuotes(diffs: SerializedState[]): SerializedState[] {
    return diffs.map(diff => diff.replace(/["']/g, c => c === '"' ? '\'' : '"'));
  }

  private compress(data: string): string {
    const compressed = gzip(data, { to: 'string' });
    return compressed;
  }

  private decompress(data: string): string {
    const text = ungzip(data, { to: 'string' });
    return text;
  }

  private restoreStates(diffs: SerializedState[]): SerializedState[] {
    const states: SerializedState[] = [];
    let prevState: SerializedState | undefined;
    for (const diff of diffs) {
      const state = this.serializer.deserializeDiff(prevState, diff);
      prevState = this.serializer.serialize(state);
      states.push(prevState);
    }
    return states;
  }

}
