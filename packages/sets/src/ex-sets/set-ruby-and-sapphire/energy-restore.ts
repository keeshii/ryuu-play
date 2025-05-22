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

export class EnergyRestore extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'RS';

  public name: string = 'Energy Restore';

  public fullName: string = 'Energy Restore RS';

  public text: string =
    'Flip 3 coins. For each heads, put a Basic Energy card from your discard pile into your hand. If you don\'t have ' +
    'that many basic Energy cards in your discard pile, put all of them into your hand. ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
