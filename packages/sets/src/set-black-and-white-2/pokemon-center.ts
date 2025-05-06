import { Effect } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { State } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { UseStadiumEffect, HealEffect } from '@ptcg/common';
import { CardTarget, PlayerType, SlotType } from '@ptcg/common';
import { ChoosePokemonPrompt } from '@ptcg/common';

export class PokemonCenter extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW2';

  public name: string = 'Pokemon Center';

  public fullName: string = 'Pokemon Center NXD';

  public text: string =
    'Once during each player\'s turn, that player may heal 20 damage ' +
    'from 1 of his or her Benched Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;

      const blocked: CardTarget[] = [];
      let hasPokemonWithDamage: boolean = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList === player.active) {
          return;
        }
        if (cardList.damage === 0) {
          blocked.push(target);
        } else {
          hasPokemonWithDamage = true;
        }
      });

      if (hasPokemonWithDamage === false) {
        throw new GameError(GameMessage.CANNOT_USE_STADIUM);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH ],
        { allowCancel: true, blocked }
      ), results => {
        const targets = results || [];

        if (targets.length === 0) {
          return state;
        }

        targets.forEach(target => {
          // Heal Pokemon
          const healEffect = new HealEffect(player, target, 20);
          store.reduceEffect(state, healEffect);
        });
      });
    }

    return state;
  }

}
