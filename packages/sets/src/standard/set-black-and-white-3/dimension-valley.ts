import {
  CardType,
  CheckAttackCostEffect,
  CheckPokemonTypeEffect,
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

export class DimensionValley extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW3';

  public name: string = 'Dimension Valley';

  public fullName: string = 'Dimension Valley PFO';

  public text: string = 'Each P Pokémon\'s attacks (both yours and your opponent\'s) cost C less.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckAttackCostEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      const index = effect.cost.indexOf(CardType.COLORLESS);

      // No cost to reduce
      if (index === -1) {
        return state;
      }

      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if (checkPokemonTypeEffect.cardTypes.includes(CardType.PSYCHIC)) {
        effect.cost.splice(index, 1);
      }

      return state;
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }
}
