import { Effect } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { State } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType, Stage } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { UseStadiumEffect, PowerEffect } from '@ptcg/common';
import { PokemonCardList } from '@ptcg/common';

export class SilentLab extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW2';

  public name: string = 'Silent Lab';

  public fullName: string = 'Silent Lab PCL';

  public text: string =
    'Each Basic Pokemon in play, in each player\'s hand, ' +
    'and in each player\'s discard pile has no Abilities.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && StateUtils.getStadiumCard(state) === this) {
      const pokemonCard = effect.card;
      const cardList = StateUtils.findCardList(state, pokemonCard);

      const isBasic = cardList instanceof PokemonCardList
        ? cardList.isBasic()
        : pokemonCard.stage === Stage.BASIC;

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
