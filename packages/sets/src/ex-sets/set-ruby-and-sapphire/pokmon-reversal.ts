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

export class PokémonReversal extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'RS';

  public name: string = 'Pokémon Reversal';

  public fullName: string = 'Pokémon Reversal RS';

  public text: string =
    'Flip a coin. If heads, your opponent switches 1 of his or her Active Pokémon with 1 of his or her Benched ' +
    'Pokémon. ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
