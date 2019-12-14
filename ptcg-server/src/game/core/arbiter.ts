import { CardList } from '../store/state/card-list';
import { CoinFlipPrompt } from '../store/prompts/coin-flip-prompt';
import { Prompt } from '../store/prompts/prompt';
import { ShuffleDeckPrompt } from '../store/prompts/shuffle-prompt';
import { State } from '../store/state/state';
import { logger } from '../../utils';


export class Arbiter {

  constructor() { }

  public resolvePrompt(state: State, prompt: Prompt<any>): Prompt<any> | null {
    const player = state.players.find(p => p.id === prompt.playerId);

    if (player === undefined) {
      return null;
    }

    if (prompt instanceof ShuffleDeckPrompt) {
      logger.log(`Arbiter shuffles deck from player ${player.name}.`);
      return { ...prompt, result: this.shuffle(player.deck) };
    }

    if (prompt instanceof CoinFlipPrompt) {
      const result = Math.round(Math.random()) === 0;
      logger.log(`Arbiter flips coin for player ${player.name} and result is ${result ? 'HEAD' : 'TAILS'}.`);
      return { ...prompt, result };
    }

    return null;
  }

  private shuffle(cards: CardList): number[] {
    const len = cards.cards.length;
    const order = [];

    for (let i = 0; i < len; i++) {
      const position = Math.min(len - 1, Math.round(Math.random() * len));
      order.push(position);
    }

    return order;
  }

}
