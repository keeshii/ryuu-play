import {
  CheckHpEffect,
  Effect,
  GameError,
  GameMessage,
  PowerEffect,
  PowerType,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerType,
} from '@ptcg/common';


export class MtMoon extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'RG';

  public name: string = 'Mt. Moon';

  public fullName: string = 'Mt. Moon RG';

  public text: string =
    'Any Pokémon (both yours and your opponent\'s) with maximum HP less than 70 can\'t use any Poké-Powers.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      const pokemonCard = effect.card;

      // Only Poke-Powers are blocked
      if (effect.power.powerType !== PowerType.POKEPOWER) {
        return state;
      }

      const pokemonSlot = StateUtils.findPokemonSlot(state, pokemonCard);
      if (pokemonSlot === undefined) {
        return state;
      }

      const checkHpEffect = new CheckHpEffect(player, pokemonSlot);
      store.reduceEffect(state, checkHpEffect);

      if (checkHpEffect.hp < 70) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      return state;
    }

    return state;
  }
}
