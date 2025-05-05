import { Effect } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { TrainerEffect } from '@ptcg/common';
import { State } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType } from '@ptcg/common';

export class ProfessorJuniper extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BW';

  public name: string = 'Professor Juniper';

  public fullName: string = 'Professor Juniper BW';

  public text: string =
    'Discard your hand and draw 7 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const cards = player.hand.cards.filter(c => c !== this);
      player.hand.moveCardsTo(cards, player.discard);
      player.deck.moveTo(player.hand, 7);
    }

    return state;
  }

}
