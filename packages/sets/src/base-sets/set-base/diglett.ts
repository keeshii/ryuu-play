import {
  CardType,
  PokemonCard,
  Stage,
} from '@ptcg/common';

export class Diglett extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 30;

  public attacks = [
    {
      name: 'Dig',
      cost: [CardType.FIGHTING],
      damage: '10',
      text: ''
    },
    {
      name: 'Mud Slap',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: '30',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public resistance = [
    { type: CardType.LIGHTNING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'BS';

  public name: string = 'Diglett';

  public fullName: string = 'Diglett BS';

}
