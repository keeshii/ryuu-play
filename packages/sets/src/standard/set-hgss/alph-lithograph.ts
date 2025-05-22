import {
  Card,
  Effect,
  GameError,
  GameMessage,
  ShowCardsPrompt,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  const prizes = player.prizes.filter(p => p.isSecret);
  const cards: Card[] = [];
  prizes.forEach(p => {
    p.cards.forEach(c => cards.push(c));
  });

  // All prizes are face-up
  if (cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Make prizes no more secret, before displaying prompt
  prizes.forEach(p => {
    p.isSecret = false;
  });

  yield store.prompt(state, new ShowCardsPrompt(player.id, GameMessage.CARDS_SHOWED_BY_EFFECT, cards), () => {
    next();
  });

  // Prizes are secret once again.
  prizes.forEach(p => {
    p.isSecret = true;
  });

  return state;
}

export class AlphLithograph extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'HGSS';

  public name: string = 'Alph Lithograph';

  public fullName: string = 'Alph Lithograph TRM';

  public text: string = 'Look at all of your face down prize cards!';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
