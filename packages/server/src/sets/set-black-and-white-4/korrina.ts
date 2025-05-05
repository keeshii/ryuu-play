import { Card } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType, CardType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { TrainerEffect } from '@ptcg/common';
import { ChooseCardsPrompt } from '@ptcg/common';
import { ShowCardsPrompt } from '@ptcg/common';
import { ShuffleDeckPrompt } from '@ptcg/common';
import { PokemonCard } from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State,
  self: Korrina, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  let pokemons = 0;
  let trainers = 0;
  const blocked: number[] = [];
  player.deck.cards.forEach((c, index) => {
    if (c instanceof TrainerCard && c.trainerType === TrainerType.ITEM) {
      trainers += 1;
    } else if (c instanceof PokemonCard && c.cardType === CardType.FIGHTING) {
      pokemons += 1;
    } else {
      blocked.push(index);
    }
  });

  // We will discard this card after prompt confirmation
  // This will prevent unblocked supporter to appear in the discard pile
  effect.preventDefault = true;

  const maxPokemons = Math.min(pokemons, 1);
  const maxTrainers = Math.min(trainers, 1);
  const count = maxPokemons + maxTrainers;

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { },
    { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxTrainers }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.hand.moveCardTo(self, player.supporter);
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

export class Korrina extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BW4';

  public name: string = 'Korrina';

  public fullName: string = 'Korrina FFI';

  public text: string =
    'Search your deck for a F Pokemon and an Item card, reveal them, ' +
    'and put them into your hand. Shuffle your deck afterward.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}
