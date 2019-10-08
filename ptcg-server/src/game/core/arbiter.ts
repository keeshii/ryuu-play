import { CardList } from '../store/state/card-list';
import { Prompt } from '../store/prompts/prompt';
import { ShuffleDeckPrompt } from '../store/prompts/shuffle-prompt';
import { logger } from '../../utils';


export class Arbiter {

  constructor() { }

  public resolvePrompt(prompt: Prompt<any>): boolean {

    if (prompt instanceof ShuffleDeckPrompt) {
      logger.log(`Arbiter shuffles deck from player ${prompt.player.name}.`);
      prompt.resolve(this.shuffle(prompt.player.deck));
      return true;
    }

    return false;
  }

  private shuffle(cards: CardList): CardList {
    return cards;
  }


}
