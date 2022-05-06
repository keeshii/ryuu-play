import { CardList } from '../store/state/card-list';
import { CoinFlipPrompt } from '../store/prompts/coin-flip-prompt';
import { Prompt } from '../store/prompts/prompt';
import { ShuffleDeckPrompt } from '../store/prompts/shuffle-prompt';
import { State } from '../store/state/state';
import { ResolvePromptAction } from '../store/actions/resolve-prompt-action';

export enum BotFlipMode {
  ALL_HEADS,
  ALL_TAILS,
  RANDOM
}

export enum BotShuffleMode {
  NO_SHUFFLE,
  REVERSE,
  RANDOM
}

export interface BotArbiterOptions {
  flipMode: BotFlipMode,
  shuffleMode: BotShuffleMode
}

export class BotArbiter {

  private options: BotArbiterOptions;
  private flipCount: number = 0;

  constructor(options: Partial<BotArbiterOptions> = {}) {
    this.options = Object.assign({
      flipMode: BotFlipMode.ALL_HEADS,
      shuffleMode: BotShuffleMode.NO_SHUFFLE
    }, options);
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

    for (let i = 0; i < len; i++) {
      const position = Math.min(len - 1, Math.round(Math.random() * len));
      const tmp = order[i];
      order[i] = order[position];
      order[position] = tmp;
    }

    return order;
  }

}
