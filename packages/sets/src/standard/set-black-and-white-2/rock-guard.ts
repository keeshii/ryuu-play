import {
  AfterDamageEffect,
  CardTag,
  Effect,
  GamePhase,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerType,
} from '@ptcg/common';

export class RockGuard extends TrainerCard {
  public tags = [CardTag.ACE_SPEC];

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BW2';

  public name: string = 'Rock Guard';

  public fullName: string = 'Rock Guard PLF';

  public text: string =
    'If the Pokémon this card is attached to is your Active Pokémon and is ' +
    'damaged by an opponent\'s attack (even if that Pokémon is Knocked Out), ' +
    'put 6 damage counters on the Attacking Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterDamageEffect && effect.target.tool === this) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
        return state;
      }

      if (state.phase === GamePhase.ATTACK) {
        effect.source.damage += 60;
      }
    }

    return state;
  }
}
