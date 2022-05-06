import { CardList } from '../state/card-list';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';

export const OrderCardsPromptType = 'Order cards';

export interface OrderCardsOptions {
  allowCancel: boolean;
}

export class OrderCardsPrompt extends Prompt<number[]> {

  readonly type: string = OrderCardsPromptType;
  
  public options: OrderCardsOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public cards: CardList,
    options?: Partial<OrderCardsOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: true
    }, options);
  }

  public validate(result: number[] | null): boolean {
    if (result === null) {
      return this.options.allowCancel;
    }
    if (result.length !== this.cards.cards.length) {
      return false;
    }
    const s = result.slice();
    s.sort();
    for (let i = 0; i < s.length; i++) {
      if (s[i] !== i) {
        return false;
      }
    }
    return true;
  }

}
