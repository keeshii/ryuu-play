import { Card } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType, SuperType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { PokemonCard } from '@ptcg/common';
import { TrainerEffect } from '@ptcg/common';
import { ChooseCardsPrompt } from '@ptcg/common';
import { ShuffleDeckPrompt } from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State,
  self: SacredAsh, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  let pokemonsInDiscard: number = 0;
  const blocked: number[] = [];
  player.discard.cards.forEach(c => {
    if (c instanceof PokemonCard) {
      pokemonsInDiscard += 1;
    }
  });

  // Player does not have correct cards in discard
  if (pokemonsInDiscard === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  const max = Math.min(5, pokemonsInDiscard);
  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_DECK,
    player.discard,
    { superType: SuperType.POKEMON },
    { min: max, max, allowCancel: true, blocked }
  ), selected => {
    cards = selected || [];
    next();
  });

  // Operation canceled by the user
  if (cards.length === 0) {
    return state;
  }

  player.hand.moveCardTo(self, player.discard);
  player.discard.moveCardsTo(cards, player.deck);

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class SacredAsh extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW3';

  public name: string = 'Sacred Ash';

  public fullName: string = 'Sacred Ash FLF';

  public text: string =
    'Shuffle 5 Pokemon from your discard pile into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}
