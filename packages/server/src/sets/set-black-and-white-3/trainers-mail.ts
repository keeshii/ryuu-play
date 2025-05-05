import { Card } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType, SuperType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { TrainerEffect } from '@ptcg/common';
import { CardList } from '@ptcg/common';
import { ChooseCardsPrompt } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { ShowCardsPrompt } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { ShuffleDeckPrompt } from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const deckTop = new CardList();
  player.deck.moveTo(deckTop, 4);

  const blocked: number[] = [];
  deckTop.cards.forEach((card, index) => {
    if (card instanceof TrainerCard && card.name === 'Trainers\' Mail') {
      blocked.push(index);
    }
  });

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    deckTop,
    { superType: SuperType.TRAINER },
    { min: 1, max: 1, allowCancel: true, blocked }
  ), selected => {
    cards = selected || [];
    next();
  });

  deckTop.moveCardsTo(cards, player.hand);
  deckTop.moveTo(player.deck);

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class TrainersMail extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW3';

  public name: string = 'Trainers\' Mail';

  public fullName: string = 'Trainers\' Mail ROS';

  public text: string =
    'Look at the top 4 cards of your deck. You may reveal a Trainer card ' +
    'you find there (except for Trainers\' Mail) and put it into your hand. ' +
    'Shuffle the other cards back into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
