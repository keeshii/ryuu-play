import { BetweenTurnsEffect, Effect, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '@ptcg/common';

export class LumBerry extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'RS';

  public name: string = 'Lum Berry';

  public fullName: string = 'Lum Berry RS';

  public text: string =
    'At any time between turns, if the Pokémon this card is attached to is affected by any Special Conditions, ' +
    'remove all of them. Then discard Lum Berry.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      [player, opponent].forEach(p => {
        if (p.active.tool === this && p.active.specialConditions.length > 0) {
          const conditions = p.active.specialConditions.slice();
          conditions.forEach(condition => {
            p.active.removeSpecialCondition(condition);
          });
          p.active.moveCardTo(this, p.discard);
          p.active.tool = undefined;
        }
      });
    }

    return state;
  }
}
