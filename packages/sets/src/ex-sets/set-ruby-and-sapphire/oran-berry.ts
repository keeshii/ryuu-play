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

export class OranBerry extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'RS';

  public name: string = 'Oran Berry';

  public fullName: string = 'Oran Berry RS';

  public text: string =
    'At any time between turns, if the Pokémon this card is attached to has at least 2 damage counters on it, ' +
    'remove 2 damage counters from it. Then discard Oran Berry. ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
