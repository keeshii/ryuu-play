import {
  CardType,
  PokemonCard,
  Stage,
} from '@ptcg/common';

export class Electrike2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 50;

  public attacks = [
    {
      name: 'Headbutt',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.METAL, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Electrike';

  public fullName: string = 'Electrike RS-2';

}
