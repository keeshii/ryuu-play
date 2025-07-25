import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class Onix extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Bind',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '10',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Rage',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '10+',
      text: 'Does 10 damage plus 10 more damage for each damage counter on Onix.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Onix';

  public fullName: string = 'Onix SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipSpecialConditions = commonAttacks.flipSpecialConditions(this, store, state, effect);
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return flipSpecialConditions.use(effect, [SpecialCondition.PARALYZED]);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      effect.damage += effect.player.active.damage;
      return state;
    }

    return state;
  }
}
