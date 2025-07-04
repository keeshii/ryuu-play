import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  PutDamageEffect,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class Sandslash extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Sandshrew';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Sand Swirl',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: '',
      text:
        'Does 20 damage to each Defending Pokémon. The Defending Pokémon can\'t retreat until the end of your ' +
        'opponent\'s next turn.'
    },
    {
      name: 'Earthquake',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '60',
      text:
        'Does 10 damage to each of your Benched Pokémon. (Don\'t apply Weakness or Resistance for Benched Pokémon.)'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [];

  public set: string = 'SS';

  public name: string = 'Sandslash';

  public fullName: string = 'Sandslash SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const cantRetreat = commonAttacks.cantRetreat(this, store, state, effect);
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage = 20;
      return cantRetreat.use(effect);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      player.bench.forEach(benched => {
        if (benched.pokemons.cards.length > 0) {
          const dealDamage = new PutDamageEffect(effect, 10);
          dealDamage.target = benched;
          store.reduceEffect(state, dealDamage);
        }
      });
    }

    return state;
  }
}
