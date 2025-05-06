import { Effect } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { State } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType, CardType, CardTag } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { UseStadiumEffect } from '@ptcg/common';
import { CheckPokemonTypeEffect } from '@ptcg/common';
import { DealDamageEffect } from '@ptcg/common';

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
