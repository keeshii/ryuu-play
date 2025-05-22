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

export class EnergySwitch extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'RS';

  public name: string = 'Energy Switch';

  public fullName: string = 'Energy Switch RS';

  public text: string = 'Move a basic Energy card attached to 1 of your Pokémon to another of your Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
