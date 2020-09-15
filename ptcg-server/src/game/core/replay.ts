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
  private diffs: SerializedState[] = [];
  private indexes: SerializedState[] = [];
  private prevState: SerializedState | undefined;
  private serializer = new StateSerializer();
  private options: ReplayOptions;

  constructor(options: Partial<ReplayOptions> = {}) {
    this.player1 = { name: '', userId: 0, ranking: 0 };
    this.player2 = { name: '', userId: 0, ranking: 0 };
    this.winner = GameWinner.NONE;
    this.created = 0;
    this.options = Object.assign({
      indexEnabled: true,
      appendEnabled: false
    }, options);
  }

  public getStateCount(): number {
    return this.diffs.length;
  }

  public getState(position: number): State {
    if (position < 0 || position >= this.diffs.length) {
      throw new GameError(GameMessage.REPLAY_INVALID_STATE);
    }

    let stateData = this.diffs[0];
    let index = 0;
    let i = 0;
    while (i !== position) {
      const indexPosition = Math.max(i, 2) * 2;
      if (this.options.indexEnabled && indexPosition <= position) {
        stateData = this.serializer.applyDiff(stateData, this.indexes[index]);
        index += 1;
        i = indexPosition;
      } else {
        i++;
        stateData = this.serializer.applyDiff(stateData, this.diffs[i]);
      }
    }

    return this.serializer.deserialize(stateData);
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
    if (this.options.indexEnabled) {
      this.rebuildIndex(this.diffs);
    }
    while (this.turnMap.length <= state.turn) {
      this.turnMap.push(this.diffs.length - 1);
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
      this.diffs = this.swapQuotes(data.states);
      this.turnMap = data.turnMap;

      if (this.options.indexEnabled) {
        this.rebuildIndex(this.diffs);
      }

      if (this.options.appendEnabled) {
        const lastState = this.getState(this.diffs.length - 1);
        this.prevState = this.serializer.serialize(lastState);
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

  private rebuildIndex(diffs: SerializedState[]): void {
    if (diffs.length === 0) {
      this.indexes = [];
      return;
    }

    let refData = diffs[0];
    let stateData = refData;
    let i = 4;
    let j = 1;
    while (i < diffs.length) {
      for (; j <= i; j++) {
        stateData = this.serializer.applyDiff(stateData, diffs[j]);
      }
      const state = this.serializer.deserialize(stateData);
      const index = this.serializer.serializeDiff(refData, state);
      refData = stateData;
      this.indexes.push(index);
      i *= 2;
    }
  }

}
