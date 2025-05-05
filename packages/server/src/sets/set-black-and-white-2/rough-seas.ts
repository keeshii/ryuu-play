import { Effect } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { State } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType, CardType } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { UseStadiumEffect, HealEffect } from '@ptcg/common';
import { PlayerType } from '@ptcg/common';
import { PokemonCardList } from '@ptcg/common';

export class RoughSeas extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW2';

  public name: string = 'Rough Seas';

  public fullName: string = 'Rough Seas PCL';

  public text: string =
    'Once during each player\'s turn, that player may heal 30 damage ' +
    'from each of his or her W Pokemon and L Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;

      const targets: PokemonCardList[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if ([CardType.WATER, CardType.LIGHTNING].includes(card.cardType) && cardList.damage > 0) {
          targets.push(cardList);
        }
      });

      if (targets.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_STADIUM);
      }

      targets.forEach(target => {
        // Heal Pokemon
        const healEffect = new HealEffect(player, target, 30);
        store.reduceEffect(state, healEffect);
      });
    }

    return state;
  }

}
