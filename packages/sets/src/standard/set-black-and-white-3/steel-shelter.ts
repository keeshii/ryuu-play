import {
  CardType,
  CheckPokemonTypeEffect,
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

export class SteelShelter extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW3';

  public name: string = 'Steel Shelter';

  public fullName: string = 'Steel Shelter PFO';

  public text: string =
    'Each M Pokémon (both yours and your opponent\'s) can\'t be affected ' +
    'by any Special Conditions. (Remove any Special Conditions affecting ' +
    'those Pokémon.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckTableStateEffect && StateUtils.getStadiumCard(state) === this) {
      state.players.forEach(player => {
        if (player.active.specialConditions.length === 0) {
          return;
        }

        const checkPokemonTypeEffect = new CheckPokemonTypeEffect(player.active);
        store.reduceEffect(state, checkPokemonTypeEffect);

        if (checkPokemonTypeEffect.cardTypes.includes(CardType.METAL)) {
          const conditions = player.active.specialConditions.slice();
          conditions.forEach(condition => {
            player.active.removeSpecialCondition(condition);
          });
        }
      });
      return state;
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }
}
