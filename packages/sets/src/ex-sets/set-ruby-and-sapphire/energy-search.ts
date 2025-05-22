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

export class EnergySearch extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'RS';

  public name: string = 'Energy Search';

  public fullName: string = 'Energy Search RS';

  public text: string =
    'Search your deck for a basic Energy card, show it to your opponent, and put it into your hand. Shuffle your ' +
    'deck afterward. ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
