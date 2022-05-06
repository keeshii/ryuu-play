import { gzip, ungzip } from '@progress/pako-esm';

import { State, GameWinner } from '../store/state/state';
import { ReplayPlayer, ReplayOptions } from './replay.interface';
import { GameError } from '../game-error';
import { GameCoreError } from '../game-message';
import { SerializedState } from '../serializer/serializer.interface';
import { StateSerializer } from '../serializer/state-serializer';

export class Replay {

  private readonly indexJumpSize: number = 16;

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
      throw new GameError(GameCoreError.ERROR_INVALID_STATE);
    }

    let stateData = this.diffs[0];
    const jumps = this.indexJumps(position);
    let i = 0;
    while (i !== position) {
      if (this.options.indexEnabled && jumps.length > 0) {
        const jump = jumps.shift() || 0;
        const index = this.indexes[(jump / this.indexJumpSize) - 1];
        stateData = this.serializer.applyDiff(stateData, index);
        i = jump;
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
      throw new GameError(GameCoreError.ERROR_INVALID_STATE);
    }
    return this.turnMap[turn];
  }

  public setCreated(created: number): void {
    this.created = created;
  }

  public appendState(state: State): void {
    const full = this.serializer.serialize(state);
    const diff = this.serializer.serializeDiff(this.prevState, state);

    // Ignore the actions, which does not modified the state, like
    // shuffling an empty deck, or changing the hand order in the same matter
    if (diff === '[[]]') {
      return;
    }

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
      throw new GameError(GameCoreError.ERROR_INVALID_STATE);
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

    this.indexes = [];
    let i = this.indexJumpSize;
    while (i < diffs.length) {
      const jumps = this.indexJumps(i);
      let stateData = diffs[0];
      let pos = 0;
      for (let j = 0; j < jumps.length - 1; j++) {
        pos = jumps[j];
        const index = this.indexes[(pos / this.indexJumpSize) - 1];
        stateData = this.serializer.applyDiff(stateData, index);
      }
      let indexData = stateData;
      while (pos < i) {
        pos++;
        indexData = this.serializer.applyDiff(indexData, diffs[pos]);
      }
      const indexState = this.serializer.deserialize(indexData);
      const indexDiff = this.serializer.serializeDiff(stateData, indexState);
      this.indexes.push(indexDiff);
      i += this.indexJumpSize;
    }
  }

  private indexJumps(position: number): number[] {
    if (position < this.indexJumpSize) {
      return [];
    }
    const jumps = [ this.indexJumpSize ];

    if (position < this.indexJumpSize * 2) {
      return jumps;
    }

    const n = Math.floor(Math.log2(position));
    let jumpSize = Math.pow(2, n);
    let pos = 0;

    while (jumpSize >= this.indexJumpSize) {
      if (pos + jumpSize <= position) {
        jumps.push(pos + jumpSize);
        pos += jumpSize;
      }
      jumpSize = jumpSize / 2;
    }

    return jumps;
  }

}
