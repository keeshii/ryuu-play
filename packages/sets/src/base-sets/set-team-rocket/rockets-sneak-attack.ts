import {
  Card,
  ChooseCardsPrompt,
  Effect,
  FilterUtils,
  GameError,
  GameMessage,
  ShuffleDeckPrompt,
  State,
  StateUtils,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  
  if (opponent.hand.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const trainersInHand = FilterUtils.count(
    opponent.hand.cards,
    { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM }
  );
  const min = Math.min(trainersInHand, 1);

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      opponent.hand,
      { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
      { min, max: 1, allowCancel: false }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  if (cards.length === 0) {
    return state;
  }

  opponent.hand.moveCardsTo(cards, opponent.deck);

  return store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
    opponent.deck.applyOrder(order);
  });
}

export class RocketsSneakAttack extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'TR';

  public name: string = 'Rocket\'s Sneak Attack';

  public fullName: string = 'Rocket\'s Sneak Attack TR';

  public text: string =
    'Look at your opponent\'s hand. If he or she has any Trainer cards, choose 1 of them. Your opponent shuffles ' +
    'that card into his or her deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
