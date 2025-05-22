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

export class LumBerry extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'RS';

  public name: string = 'Lum Berry';

  public fullName: string = 'Lum Berry RS';

  public text: string =
    'At any time between turns, if the Pokémon this card is attached to is affected by any Special Conditions, ' +
    'remove all of them. Then discard Lum Berry. ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
