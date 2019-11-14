import { CardList } from '../store/state/card-list';
import { CoinFlipPrompt } from '../store/prompts/coin-flip-prompt';
import { Prompt } from '../store/prompts/prompt';
import { ShuffleDeckPrompt } from '../store/prompts/shuffle-prompt';
import { logger } from '../../utils';


export class Arbiter {

  constructor() { }

  public resolvePrompt(prompt: Prompt<any>): boolean {

    if (prompt instanceof ShuffleDeckPrompt) {
      logger.log(`Arbiter shuffles deck from player ${prompt.player.name}.`);
      const order = this.shuffle(prompt.player.deck);
      prompt.resolve(order);
      return true;
    }
    
    if (prompt instanceof CoinFlipPrompt) {
      const result = Math.round(Math.random()) === 0;
      logger.log(`Arbiter flips coin for player ${prompt.player.name} and result is ${result ? 'HEAD' : 'TAILS'}.`);
      prompt.resolve(result);
      return true;
    }

    return false;
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
