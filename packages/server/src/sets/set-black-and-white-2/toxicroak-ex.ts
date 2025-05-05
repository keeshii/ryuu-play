import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, CardTag, SpecialCondition } from '@ptcg/common';
import { StoreLike, State } from '@ptcg/common';
import { AttackEffect } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { AddSpecialConditionsEffect } from '@ptcg/common';


export class ToxicroakEx extends PokemonCard {

  public tags = [ CardTag.POKEMON_EX ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 170;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Triple Poison',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 0,
      text: 'Your opponent\'s Active Pokemon is now Poisoned. Put 3 damage ' +
        'counters instead of 1 on that Pokemon between turns.'
    }, {
      name: 'Smash Uppercut',
      cost: [ CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS ],
      damage: 80,
      text: 'This attack\'s damage isn\'t affected by Resistance.'
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Toxicroak EX';

  public fullName: string = 'Toxicroak EX FLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      specialCondition.poisonDamage = 30;
      return store.reduceEffect(state, specialCondition);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      effect.ignoreResistance = true;
    }

    return state;
  }

}
