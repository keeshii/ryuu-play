import { CheckRetreatCostEffect, Effect, State, StoreLike, TrainerCard, TrainerType } from '@ptcg/common';

export class FloatStone extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BW2';

  public name: string = 'Float Stone';

  public fullName: string = 'Float Stone PLF';

  public text: string = 'The Pokémon this card is attached to has no Retreat Cost.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatCostEffect && effect.player.active.trainers.cards.includes(this)) {
      effect.cost = [];
    }

    return state;
  }
}
