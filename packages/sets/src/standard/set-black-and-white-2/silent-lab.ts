import {
  Effect,
  GameError,
  GameMessage,
  PowerEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerType,
  UseStadiumEffect,
} from '@ptcg/common';

export class SilentLab extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW2';

  public name: string = 'Silent Lab';

  public fullName: string = 'Silent Lab PCL';

  public text: string =
    'Each Basic Pokémon in play, in each player\'s hand, and in each player\'s discard pile has no Abilities.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && StateUtils.getStadiumCard(state) === this) {
      const pokemonCard = effect.card;
      const pokemonSlot = StateUtils.findPokemonSlot(state, pokemonCard);

      const isBasic = pokemonSlot ? pokemonSlot.isBasic() : pokemonCard.stage === Stage.BASIC;

      if (isBasic) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      return state;
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }
}
