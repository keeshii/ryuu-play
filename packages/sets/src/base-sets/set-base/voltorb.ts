import {
  CardType,
  PokemonCard,
  Stage,
} from '@ptcg/common';

export class Voltorb extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 40;

  public attacks = [
    {
      name: 'Tackle',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Voltorb';

  public fullName: string = 'Voltorb BS';

}
