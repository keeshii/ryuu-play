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

export class DevolutionSpray extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public name: string = 'Devolution Spray';

  public fullName: string = 'Devolution Spray BS';

  public text: string =
    'Choose 1 of your own Pokémon in play and a Stage of Evolution. Discard all Evolution cards of that Stage or ' +
    'higher attached to that Pokémon. That Pokémon is no longer Asleep, Confused, Paralyzed, Poisoned, or anything ' +
    'else that might be the result of an attack (just as if you had evolved it). ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
