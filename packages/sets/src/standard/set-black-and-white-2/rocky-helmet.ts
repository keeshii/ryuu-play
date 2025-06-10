import {
  AfterDamageEffect,
  Effect,
  GamePhase,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerType,
} from '@ptcg/common';

export class RockyHelmet extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BW2';

  public name: string = 'Rocky Helmet';

  public fullName: string = 'Rocky Helmet BC';

  public text: string =
    'If the Pokémon this card is attached to is your Active Pokémon and is ' +
    'damaged by an opponent\'s attack (even if that Pokémon is Knocked Out), ' +
    'put 2 damage counters on the Attacking Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterDamageEffect && effect.target.trainers.cards.includes(this)) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
        return state;
      }

      if (state.phase === GamePhase.ATTACK) {
        effect.source.damage += 20;
      }
    }

    return state;
  }
}
