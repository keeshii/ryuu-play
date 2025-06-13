import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Kirlia extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Ralts';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Psyshock',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Link Blast',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: '60',
      text:
        'If Kirlia and the Defending Pokémon have a different amount of Energy attached to them, this attack\'s base ' +
        'damage is 30 instead of 60.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Kirlia';

  public fullName: string = 'Kirlia SS';

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
