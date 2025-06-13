import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Electrode extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Voltorb';

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 90;

  public attacks = [
    {
      name: 'Tackle',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
    {
      name: 'Chain Lightning',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING],
      damage: '20',
      text:
        'If the Defending Pokémon isn\'t C, this attack does 10 damage to each Benched Pokémon of the same type as ' +
        'the Defending Pokémon (including your own).'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Electrode';

  public fullName: string = 'Electrode JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
