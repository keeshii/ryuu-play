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

export class RareCandy extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'SS';

  public name: string = 'Rare Candy';

  public fullName: string = 'Rare Candy SS';

  public text: string =
    'Choose 1 of your Basic Pokémon in play. If you have a Stage 1 or Stage 2 card that evolves from that Pokémon ' +
    'in your hand, put that card on the Basic Pokémon. (This counts as evolving that Pokémon.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
