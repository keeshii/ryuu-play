import { CardList } from '@ptcg/common';
import { CoinFlipPrompt } from '@ptcg/common';
import { Prompt } from '@ptcg/common';
import { ShuffleDeckPrompt } from '@ptcg/common';
import { StateLog } from '@ptcg/common';
import { State } from '@ptcg/common';
import { ResolvePromptAction } from '@ptcg/common';
import {GameLog} from '@ptcg/common';


export class Arbiter {

  constructor() { }

  public resolvePrompt(state: State, prompt: Prompt<any>): ResolvePromptAction | undefined {
    const player = state.players.find(p => p.id === prompt.playerId);

    if (player === undefined) {
      return;
    }

    if (prompt instanceof ShuffleDeckPrompt) {
      const result = this.shuffle(player.deck);
      return new ResolvePromptAction(prompt.id, result);
    }

    if (prompt instanceof CoinFlipPrompt) {
      const result = Math.round(Math.random()) === 0;
      const message = result
        ? GameLog.LOG_PLAYER_FLIPS_HEADS
        : GameLog.LOG_PLAYER_FLIPS_TAILS;
      const log = new StateLog(message, { name: player.name });
      return new ResolvePromptAction(prompt.id, result, log);
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
