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

export class MysteriousFossil extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'SS';

  public name: string = 'Mysterious Fossil';

  public fullName: string = 'Mysterious Fossil SS';

  public text: string =
    'Play Mysterious Fossil as if it were a Basic Pokémon. While in play, Mysterious Fossil counts as a C Pokémon ' +
    '(instead of a Trainer card). Mysterious Fossil has no attacks of its own, can\'t retreat, and can\'t be affected ' +
    'by any Special Conditions. If Mysterious is Knocked Out, it doesn\'t count as a Knocked Out Pokémon. (Discard ' +
    'it anyway.) At any time during your turn before your attack, you may discard Mysterious Fossil from play.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
