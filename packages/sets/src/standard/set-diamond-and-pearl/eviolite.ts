import { Effect, PutDamageEffect, State, StoreLike, TrainerCard, TrainerType } from '@ptcg/common';

export class Eviolite extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'DP';

  public name: string = 'Eviolite';

  public fullName: string = 'Eviolite NV';

  public text: string =
    'If the Pokémon this card is attached to is a Basic Pokémon, ' +
    'any damage done to this Pokémon by attacks is reduced by 20 ' +
    '(after applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect) {
      if (effect.target.tool === this && effect.target.isBasic()) {
        effect.damage -= 20;
      }
    }

    return state;
  }
}
