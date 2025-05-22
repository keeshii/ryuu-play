import {
  Card,
  ChooseCardsPrompt,
  Effect,
  GameError,
  GameMessage,
  State,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: VsSeeker,
  effect: TrainerEffect
): IterableIterator<State> {
  const player = effect.player;

  const hasSupporter = player.discard.cards.some(c => {
    return c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER;
  });

  if (!hasSupporter) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.discard,
      { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
      { min: 1, max: 1, allowCancel: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  if (cards.length > 0) {
    player.hand.moveCardTo(self, player.discard);
    player.discard.moveCardsTo(cards, player.hand);
  }

  return state;
}

export class VsSeeker extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW2';

  public name: string = 'VS Seeker';

  public fullName: string = 'VS Seeker PHF';

  public text: string = 'Put a Supporter card from your discard pile into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }
}
