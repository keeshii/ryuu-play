import { Effect } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { TrainerEffect } from '@ptcg/common';
import { State } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType } from '@ptcg/common';

export class Bicycle extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW2';

  public name: string = 'Bicycle';

  public fullName: string = 'Bicycle PLS';

  public text: string =
    'Draw cards until you have 4 cards in your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const cards = player.hand.cards.filter(c => c !== this);
      const cardsToDraw = Math.max(0, 4 - cards.length);

      if (cardsToDraw === 0 || player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.deck.moveTo(player.hand, cardsToDraw);
    }

    return state;
  }

}
