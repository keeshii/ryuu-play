import {
  Effect,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  // const player = effect.player;
  // const opponent = StateUtils.getOpponent(state, player);
  return state;
}

export class MrFuji extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'FO';

  public name: string = 'Mr. Fuji';

  public fullName: string = 'Mr. Fuji FO';

  public text: string = 'Choose a Pokémon on your Bench. Shuffle it and any cards attached to it into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
