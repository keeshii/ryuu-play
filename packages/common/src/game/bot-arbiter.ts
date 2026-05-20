import { CardList } from '../store';
import { CoinFlipPrompt } from '../store';
import { Prompt } from '../store';
import { ShuffleDeckPrompt } from '../store';
import { State } from '../store';
import { ResolvePromptAction } from '../store';

export enum BotFlipMode {
  ALL_HEADS,
  ALL_TAILS,
  CUSTOM,
  RANDOM
}

export enum BotShuffleMode {
  NO_SHUFFLE,
  REVERSE,
  RANDOM
}

export interface BotArbiterOptions {
  flipMode: BotFlipMode,
  shuffleMode: BotShuffleMode,
  flipResults: boolean[]
}

export class BotArbiter {

  private options: BotArbiterOptions;
  private flipCount: number = -1;

  constructor(options: Partial<BotArbiterOptions> = {}) {
    this.options = Object.assign({
      flipMode: BotFlipMode.ALL_HEADS,
      shuffleMode: BotShuffleMode.NO_SHUFFLE,
      flipResults: []
    }, options);

    // We do not allow CUSTOM flip mode without provided flip results
    if (this.options.flipMode === BotFlipMode.CUSTOM && this.options.flipResults.length === 0) {
      this.options.flipMode =  BotFlipMode.ALL_HEADS;
    }
  }

  public resolvePrompt(state: State, prompt: Prompt<any>): ResolvePromptAction | undefined {
    const player = state.players.find(p => p.id === prompt.playerId);

    if (player === undefined) {
      return;
    }

    if (prompt instanceof ShuffleDeckPrompt) {
      let result: number[] = [];
      switch (this.options.shuffleMode) {
        case BotShuffleMode.RANDOM:
          result = this.shuffle(player.deck);
          return new ResolvePromptAction(prompt.id, result);
        case BotShuffleMode.REVERSE:
          for (let i = player.deck.cards.length - 1; i >= 0; i--) {
            result.push(i);
          }
          return new ResolvePromptAction(prompt.id, result);
        default:
          for (let i = 0; i < player.deck.cards.length; i++) {
            result.push(i);
          }
          return new ResolvePromptAction(prompt.id, result);
      }
    }

    if (prompt instanceof CoinFlipPrompt) {
      this.flipCount += 1;
      let result: boolean = false;
      switch (this.options.flipMode) {
        case BotFlipMode.RANDOM:
          result = Math.round(Math.random()) === 0;
          return new ResolvePromptAction(prompt.id, result);
        case BotFlipMode.CUSTOM:
          result = this.options.flipResults[this.flipCount % this.options.flipResults.length];
          return new ResolvePromptAction(prompt.id, result);
        case BotFlipMode.ALL_TAILS:
          // Every 10th coin is opposite to avoid infinite loops.
          result = (this.flipCount % 10 === 9) ? true : false;
          return new ResolvePromptAction(prompt.id, result);
        default:
          result = (this.flipCount % 10 === 9) ? false : true;
          return new ResolvePromptAction(prompt.id, result);
      }
    }
  }

  private shuffle(cards: CardList): number[] {
    const len = cards.cards.length;
    const order: number[] = [];

    for (let i = 0; i < len; i++) {
      order.push(i);
    }

    for (let i = len-1; i > 0; i--) {
      const position = Math.floor(Math.random() * (i+1));
      [order[i], order[position]] = [order[position], order[i]];
    }

    return order;
  }

}
