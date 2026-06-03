import {
  CardType,
  PokemonCard,
  Stage,
} from '@ptcg/common';

export class Squirtle extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Shell Attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Squirtle';

  public fullName: string = 'Squirtle TR';

}
