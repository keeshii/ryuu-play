import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Magneton extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Magnemite';

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Sonicboom',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: '20',
      text:
        'Don\'t apply Weakness and Resistance for this attack. (Any other effects that would happen after applying ' +
        'Weakness and Resistance still happen.)'
    },
    {
      name: 'Selfdestruct',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING],
      damage: '100',
      text:
        'Does 20 damage to each Pokémon on each player\'s Bench. (Don\'t apply Weakness and Resistance for Benched ' +
        'Pokémon.) Magneton does 100 damage to itself.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Magneton';

  public fullName: string = 'Magneton FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
