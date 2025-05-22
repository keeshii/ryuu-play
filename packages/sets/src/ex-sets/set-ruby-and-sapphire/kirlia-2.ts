import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Kirlia2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Ralts';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public attacks = [
    {
      name: 'Dazzle Dance',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Flip a coin. If heads, each Defending Pokémon is now Confused.'
    },
    {
      name: 'Life Drain',
      cost: [CardType.PSYCHIC],
      damage: '',
      text:
        'Flip a coin. If heads, put damage counters on the Defending Pokémon until it is 10 HP away from being ' +
        'Knocked Out. '
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Kirlia';

  public fullName: string = 'Kirlia RS-2';

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
