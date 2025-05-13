import { PokemonCard } from '@ptcg/common';
import { Stage, CardType } from '@ptcg/common';
import { StoreLike, State, StateUtils } from '@ptcg/common';
import { AttackEffect } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { ApplyWeaknessEffect, AfterDamageEffect } from '@ptcg/common';


export class Rayquaza extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 120;

  public weakness = [{ type: CardType.DRAGON }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Dragon Pulse',
      cost: [ CardType.LIGHTNING ],
      damage: '40',
      text: 'Discard the top 2 cards of your deck.'
    },
    {
      name: 'Shred',
      cost: [CardType.FIRE, CardType.LIGHTNING, CardType.COLORLESS ],
      damage: '90',
      text: 'This attack\'s damage isn\'t affected by any effects on ' +
        'the Defending Pokemon.'
    }
  ];

  public set: string = 'BW';

  public name: string = 'Rayquaza';

  public fullName: string = 'Rayquaza DRV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      player.deck.moveTo(player.discard, 2);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const applyWeakness = new ApplyWeaknessEffect(effect, 90);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }

    return state;
  }

}
