import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, SpecialCondition } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { PowerEffect, AttackEffect } from '@ptcg/common';
import { PowerType } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { PlayerType } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { CoinFlipPrompt } from '@ptcg/common';
import { PutDamageEffect, AddSpecialConditionsEffect } from '@ptcg/common';

export class MrMime extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Bench Barrier',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to your Benched Pokemon by attacks.'
  }];

  public attacks = [{
    name: 'Psy Bolt',
    cost: [ CardType.PSYCHIC, CardType.COLORLESS ],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokemon is now Paralyzed.'
  }];

  public set: string = 'BW2';

  public name: string = 'Mr. Mime';

  public fullName: string = 'Mr Mime PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      const targetPlayer = StateUtils.findOwner(state, effect.target);

      let isMrMimeInPlay = false;
      targetPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isMrMimeInPlay = true;
        }
      });

      if (!isMrMimeInPlay) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.preventDefault = true;
    }

    return state;
  }

}
