import {
  CardTag,
  CardType,
  CheckPokemonTypeEffect,
  DealDamageEffect,
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

export class FightingStadium extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW4';

  public name: string = 'Fighting Stadium';

  public fullName: string = 'Fighting Stadium FFI';

  public text: string =
    'The attacks of each F Pokémon in play (both yours and your opponent\'s) ' +
    'do 20 more damage to the Defending Pokémon-EX (before applying Weakness ' +
    'and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Not opponent's active pokemon
      if (effect.target !== opponent.active) {
        return state;
      }

      // Not attacking Pokemon EX
      const targetCard = effect.target.getPokemonCard();
      if (!targetCard || !targetCard.tags.includes(CardTag.POKEMON_EX)) {
        return state;
      }

      // Attack not made by the Fighting Pokemon
      const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkPokemonType);
      if (!checkPokemonType.cardTypes.includes(CardType.FIGHTING)) {
        return state;
      }

      effect.damage += 20;
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }
}
