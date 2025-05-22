import {
  CardType,
  PokemonCard,
  Stage,
} from '@ptcg/common';

export class Dratini extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 40;

  public attacks = [
    {
      name: 'Pound',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Dratini';

  public fullName: string = 'Dratini BS';

}
