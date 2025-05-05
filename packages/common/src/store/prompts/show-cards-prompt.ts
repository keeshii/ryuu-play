import { Card } from '../card/card';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';

export interface ShowCardsOptions {
  allowCancel: boolean;
}

export class ShowCardsPrompt extends Prompt<true> {

  readonly type: string = 'Show cards';

  public options: ShowCardsOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public cards: Card[],
    options?: Partial<ShowCardsOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: false
    }, options);
  }

}
