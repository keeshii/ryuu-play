import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardType, CardTag } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class FightingStadium extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW4';

  public name: string = 'Fighting Stadium';

  public fullName: string = 'Fighting Stadium FFI';

  public text: string =
    'The attacks of each F Pokemon in play (both yours and your opponent\'s) ' +
    'do 20 more damage to the Defending Pokemon-EX (before applying Weakness ' +
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
