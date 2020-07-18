import { CardList } from "../state/card-list";
import { Prompt } from "./prompt";

export const OrderCardsPromptType = 'Order cards';

export interface OrderCardsOptions {
  allowCancel: boolean;
}

export class OrderCardsPrompt extends Prompt<number[]> {

  readonly type: string = OrderCardsPromptType;
  
  public options: OrderCardsOptions;

  constructor(
    playerId: number,
    public message: string,
    public cards: CardList,
    options?: Partial<OrderCardsOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: true
    }, options);
  }

}
