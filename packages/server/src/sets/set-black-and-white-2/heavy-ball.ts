import { Card } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType, SuperType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { TrainerEffect } from '@ptcg/common';
import { ChooseCardsPrompt } from '@ptcg/common';
import { ShowCardsPrompt } from '@ptcg/common';
import { ShuffleDeckPrompt } from '@ptcg/common';
import { PokemonCard } from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const blocked: number[] = [];
  player.deck.cards.forEach((card, index) => {
    if (card instanceof PokemonCard && card.retreat.length < 3) {
      blocked.push(index);
    }
  });

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.POKEMON },
    { min: 1, max: 1, allowCancel: true, blocked }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.deck.moveCardsTo(cards, player.hand);

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

export class HeavyBall extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW2';

  public name: string = 'Heavy Ball';

  public fullName: string = 'Heavy Ball NXD';

  public text: string =
    'Search your deck for a Pokemon with a Retreat Cost of 3 or more, ' +
    'reveal it, and put it into your hand. Shuffle your deck afterward.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
