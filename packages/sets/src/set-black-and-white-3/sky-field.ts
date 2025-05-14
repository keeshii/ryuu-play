import {
  CheckTableStateEffect,
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

export class SkyField extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW3';

  public name: string = 'Sky Field';

  public fullName: string = 'Sky Field ROS';

  public text: string =
    'Each player can have 8 Pokémon on his or her Bench. (When this card ' +
    'leaves play, each player discards Benched Pokémon until he or she has ' +
    '5 Pokémon on the Bench. The owner of this card discard first.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckTableStateEffect && StateUtils.getStadiumCard(state) === this) {
      effect.benchSize = 8;
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }
}
