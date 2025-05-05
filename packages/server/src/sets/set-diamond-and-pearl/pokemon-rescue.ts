import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType, SuperType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { TrainerEffect } from '@ptcg/common';
import { ChooseCardsPrompt } from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  // Player has no Pokemons in the discard pile
  if (!player.discard.cards.some(c => c.superType === SuperType.POKEMON)) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  return store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.discard,
    { superType: SuperType.POKEMON },
    { min: 1, max: 1, allowCancel: true }
  ), selected => {
    if (selected && selected.length > 0) {
      // Discard trainer only when user selected a Pokemon
      player.hand.moveCardTo(effect.trainerCard, player.discard);
      // Recover discarded Pokemon
      player.discard.moveCardsTo(selected, player.hand);
    }
  });
}

export class PokemonRescue extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DP';

  public name: string = 'Pokemon Rescue';

  public fullName: string = 'Pokemon Rescue PL';

  public text: string =
    'Search your discard pile for a Pokemon, show it to your opponent, ' +
    'and put it into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
