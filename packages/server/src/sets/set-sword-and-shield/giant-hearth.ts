import { Effect } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { State } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType, SuperType, EnergyType } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { UseStadiumEffect } from '@ptcg/common';
import { ChooseCardsPrompt } from '@ptcg/common';
import { Card } from '@ptcg/common';
import { ShowCardsPrompt } from '@ptcg/common';
import { ShuffleDeckPrompt } from '@ptcg/common';

function* useStadium(next: Function, store: StoreLike, state: State, effect: UseStadiumEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const stadiumUsedTurn = player.stadiumUsedTurn;
  let cards: Card[] = [];

  if (player.deck.cards.length === 0 || player.hand.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_USE_STADIUM);
  }

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    player.hand,
    { },
    { min: 1, max: 1, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length === 0) {
    player.stadiumUsedTurn = stadiumUsedTurn;
    return state;
  }

  player.hand.moveCardsTo(cards, player.discard);

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
    { min: 1, max: 2, allowCancel: true }
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

export class GiantHearth extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'SSH';

  public name: string = 'Giant Hearth';

  public fullName: string = 'Giant Hearth UNM';

  public text: string =
    'Once during each player\'s turn, that player may discard a card from ' +
    'their hand. If they do, that player searches their deck for up to ' +
    '2 R Energy cards, reveals them, and puts them into their hand. ' +
    'Then, that player shuffles their deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      const generator = useStadium(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
