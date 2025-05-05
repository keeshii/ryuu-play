import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, CardTag } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { PowerEffect, AttackEffect } from '@ptcg/common';
import { PowerType } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';

export class Hawlucha extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 70;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [ ];

  public powers = [{
    name: 'Shining Spirit',
    powerType: PowerType.ABILITY,
    text: 'Damage from this Pokemon\'s attacks isn\'t affected by ' +
      'Weakness or Resistance.'
  }];

  public attacks = [{
    name: 'Flying Press',
    cost: [ CardType.FIGHTING ],
    damage: 60,
    text: 'If your opponent\'s Active Pokemon isn\'t a Pokemon-EX, ' +
      'this attack does nothing.'
  }];

  public set: string = 'BW4';

  public name: string = 'Hawlucha';

  public fullName: string = 'Hawlucha FFI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const defending = opponent.active.getPokemonCard();
      if (!defending || !defending.tags.includes(CardTag.POKEMON_EX)) {
        effect.damage = 0;
        return state;
      }

      // Ability - ignore weakness and resistance for this attack.
      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.ignoreWeakness = true;
      effect.ignoreResistance = true;
    }

    return state;
  }

}
