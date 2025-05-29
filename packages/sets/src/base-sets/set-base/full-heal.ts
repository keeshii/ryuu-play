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


export class FullHeal extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public name: string = 'Full Heal';

  public fullName: string = 'Full Heal BS';

  public text: string = 'Your Active Pokémon is no longer Asleep, Confused, Paralyzed, or Poisoned.';

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
