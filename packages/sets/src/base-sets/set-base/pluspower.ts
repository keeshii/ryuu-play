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

export class Pluspower extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public name: string = 'PlusPower';

  public fullName: string = 'PlusPower BS';

  public text: string =
    'Attach PlusPower to your Active Pokémon. At the end of your turn, discard PlusPower. If this Pokémon\'s attack ' +
    'does damage to the Defending Pokémon (after applying Weakness and Resistance), the attack does 10 more damage ' +
    'to the Defending Pokémon. ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
