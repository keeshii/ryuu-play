import {
  CardType,
  CheckRetreatCostEffect,
  Effect,
  GameError,
  GameMessage,
  Stage,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerType,
  UseStadiumEffect,
} from '@ptcg/common';

export class SkyarrowBridge extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW';

  public name: string = 'Skyarrow Bridge';

  public fullName: string = 'Skyarrow Bridge NXD';

  public text: string = 'The Retreat Cost of each Basic Pokémon in play is C less.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatCostEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard && pokemonCard.stage == Stage.BASIC) {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index !== -1) {
          effect.cost.splice(index, 1);
        }
      }
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }
}
