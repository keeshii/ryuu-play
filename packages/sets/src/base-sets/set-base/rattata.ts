import {
  CardType,
  PokemonCard,
  Stage,
} from '@ptcg/common';

export class Rattata extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 30;

  public attacks = [
    {
      name: 'Bite',
      cost: [CardType.COLORLESS],
      damage: '20',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [];

  public set: string = 'BS';

  public name: string = 'Rattata';

  public fullName: string = 'Rattata BS';

}
