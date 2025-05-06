import { TrainerCard } from '@ptcg/common';
import { TrainerType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { TrainerEffect } from '@ptcg/common';
import { ShowCardsPrompt } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { Card } from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  const prizes = player.prizes.filter(p => p.isSecret);
  const cards: Card[] = [];
  prizes.forEach(p => { p.cards.forEach(c => cards.push(c)); });

  // All prizes are face-up
  if (cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Make prizes no more secret, before displaying prompt
  prizes.forEach(p => { p.isSecret = false; });

  yield store.prompt(state, new ShowCardsPrompt(
    player.id,
    GameMessage.CARDS_SHOWED_BY_EFFECT,
    cards,
  ), () => { next(); });

  // Prizes are secret once again.
  prizes.forEach(p => { p.isSecret = true; });

  return state;
}

export class AlphLithograph extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'HGSS';

  public name: string = 'Alph Lithograph';

  public fullName: string = 'Alph Lithograph TRM';

  public text: string =
    'Look at all of your face down prize cards!';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
