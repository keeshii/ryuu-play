import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class Dugtrio extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Diglett';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Sonicboom',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: '30',
      text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
    },
    {
      name: 'Rumble',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: 'The Defending Pokémon can\'t retreat until the end of your opponent\'s next turn.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Dugtrio';

  public fullName: string = 'Dugtrio RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const cantRetreat = commonAttacks.cantRetreat(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return cantRetreat.use(effect);
    }

    return state;
  }
}
