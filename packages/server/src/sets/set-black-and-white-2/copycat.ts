import { Effect } from '@ptcg/common';
import { TrainerEffect } from '@ptcg/common';
import { State } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType } from '@ptcg/common';
import { ShuffleDeckPrompt } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State,
  self: Copycat, effect: TrainerEffect): IterableIterator<State> {

  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const cards = player.hand.cards.filter(c => c !== self);

  if (cards.length > 0) {
    player.hand.moveCardsTo(cards, player.deck);

    yield store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
      player.deck.applyOrder(order);
      next();
    });
  }

  const cardsNumber = opponent.hand.cards.length;
  player.deck.moveTo(player.hand, cardsNumber);
  return state;
}

export class Copycat extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BW2';

  public name: string = 'Copycat';

  public fullName: string = 'Copycat CES';

  public text: string =
    'Shuffle your hand into your deck. Then, draw a card for each card in ' +
    'your opponent\'s hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}
