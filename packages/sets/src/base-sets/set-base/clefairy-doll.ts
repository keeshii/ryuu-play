import {
  Effect,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  // TODO - not implemented
  return state;
}

export class ClefairyDoll extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public name: string = 'Clefairy Doll';

  public fullName: string = 'Clefairy Doll BS';

  public text: string =
    'Play Clefairy Doll as if it were a Basic Pokémon. While in play, Clefairy Doll counts a a Pokémon (instead of ' +
    'a Trainer card). Clefairy Doll has no attacks, can\'t retreat, and can\'t be Asleep, Confused, Paralyzed, or ' +
    'Poisoned. If Clefairy Doll is Knocked Out, it doesn\'t count as a Knocked Out Pokémon. At any time during your ' +
    'turn before your attack, you may discard Clefairy Doll.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
