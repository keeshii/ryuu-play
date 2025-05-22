import {
  CardType,
  PokemonCard,
  Stage,
} from '@ptcg/common';

export class Seel extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 60;

  public attacks = [
    {
      name: 'Headbutt',
      cost: [CardType.WATER],
      damage: '10',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Seel';

  public fullName: string = 'Seel BS';

}
