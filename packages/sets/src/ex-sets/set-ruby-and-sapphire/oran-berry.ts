import { BetweenTurnsEffect, Effect, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '@ptcg/common';

export class OranBerry extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'RS';

  public name: string = 'Oran Berry';

  public fullName: string = 'Oran Berry RS';

  public text: string =
    'At any time between turns, if the Pokémon this card is attached to has at least 2 damage counters on it, ' +
    'remove 2 damage counters from it. Then discard Oran Berry.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      [player, opponent].forEach(p => {
        if (p.active.tool === this && p.active.damage >= 20) {
          p.active.damage -= 20;
          p.active.moveCardTo(this, p.discard);
        }
      });
    }

    return state;
  }
}
