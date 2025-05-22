import {
  CardType,
  PokemonCard,
  Stage,
} from '@ptcg/common';

export class Staryu extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 40;

  public attacks = [
    {
      name: 'Slap',
      cost: [CardType.WATER],
      damage: '20',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Staryu';

  public fullName: string = 'Staryu BS';

}
