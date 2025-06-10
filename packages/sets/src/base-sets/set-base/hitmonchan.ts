import {
  CardType,
  PokemonCard,
  Stage,
} from '@ptcg/common';

export class Hitmonchan extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Jab',
      cost: [CardType.FIGHTING],
      damage: '20',
      text: ''
    },
    {
      name: 'Special Punch',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: '40',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Hitmonchan';

  public fullName: string = 'Hitmonchan BS';

}
