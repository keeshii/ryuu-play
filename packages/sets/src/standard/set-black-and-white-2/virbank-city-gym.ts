import {
  BetweenTurnsEffect,
  Effect,
  GameError,
  GameMessage,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerType,
  UseStadiumEffect,
} from '@ptcg/common';

export class VirbankCityGym extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW2';

  public name: string = 'Virbank City Gym';

  public fullName: string = 'Virbank City Gym PLS';

  public text: string =
    'Put 2 more damage counters on Poisoned Pokémon (both yours and your opponent\'s) between turns.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof BetweenTurnsEffect && StateUtils.getStadiumCard(state) === this) {
      effect.poisonDamage += 20;
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }
}
