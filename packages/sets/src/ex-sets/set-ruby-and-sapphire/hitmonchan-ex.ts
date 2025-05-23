import { AttackEffect, CardTag, CardType, Effect, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class HitmonchanEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 90;

  public attacks = [
    {
      name: 'Steady Punch',
      cost: [CardType.FIGHTING],
      damage: '10+',
      text: 'Flip a coin. If heads, this attack does 10 damage plus 10 more damage.',
    },
    {
      name: 'Sky Uppercut',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: '50',
      text: 'This attack\'s damage is not affected by Resistance.',
    },
  ];

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Hitmonchan ex';

  public fullName: string = 'Hitmonchan ex RS';

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
