import { DealDamageEffect, Effect, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '@ptcg/common';

export class MuscleBand extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BW2';

  public name: string = 'Muscle Band';

  public fullName: string = 'Muscle Band XY';

  public text: string =
    'The attacks of the Pokémon this card is attached to do 20 more ' +
    'damage to our opponent\'s Active Pokémon (before aplying Weakness ' +
    'and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && effect.source.trainers.cards.includes(this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (effect.damage > 0 && effect.target === opponent.active) {
        effect.damage += 20;
      }
    }

    return state;
  }
}
