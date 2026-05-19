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

export class Diglett extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Dig Under',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Choose 1 of your opponent\'s Pokémon. This attack does 10 damage to that Pokémon. This attack\'s damage ' +
        'isn\'t affected by Weakness or Resistance.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Diglett';

  public fullName: string = 'Diglett RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const damageOpponentPokemon = commonAttacks.damageOpponentPokemon(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;
      return damageOpponentPokemon.use(effect, 10);
    }

    return state;
  }
}
