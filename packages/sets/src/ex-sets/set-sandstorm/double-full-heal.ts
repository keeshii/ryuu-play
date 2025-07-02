import {
  Effect,
  GameError,
  GameMessage,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

export class DoubleFullHeal extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'SS';

  public name: string = 'Double Full Heal';

  public fullName: string = 'Double Full Heal SS';

  public text: string = 'Remove all Special Conditions from each of your Active Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.active.specialConditions.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const conditions = player.active.specialConditions.slice();
      conditions.forEach(condition => {
        player.active.removeSpecialCondition(condition);
      });
    }

    return state;
  }
}
