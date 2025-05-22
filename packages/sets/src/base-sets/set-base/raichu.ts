import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Raichu extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pikachu';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 80;

  public attacks = [
    {
      name: 'Agility',
      cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text:
        'Flip a coin. If heads, during your opponent\'s next turn, prevent all effects of attacks, including damage, ' +
        'done to Raichu. '
    },
    {
      name: 'Thunder',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: '60',
      text: 'Flip a coin. If tails, Raichu does 30 damage to itself.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Raichu';

  public fullName: string = 'Raichu BS';

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
