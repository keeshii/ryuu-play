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

  public hp: number = 40;

  public attacks = [
    {
      name: 'Dig Under',
      cost: [CardType.FIGHTING],
      damage: '',
      text:
        'Choose 1 of your opponent\'s Pokémon. This attack does 10 damage to that Pokémon. Don\'t apply Weakness and ' +
        'Resistance for this attack. (Any other effects that would happen after applying Weakness and Resistance ' +
        'still happen.)'
    },
    {
      name: 'Scratch',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public resistance = [
    { type: CardType.LIGHTNING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'TR';

  public name: string = 'Diglett';

  public fullName: string = 'Diglett TR';

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
