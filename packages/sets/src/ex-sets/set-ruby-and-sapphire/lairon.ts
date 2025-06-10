import { CardType, PokemonCard, Stage } from '@ptcg/common';

export class Lairon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Aron';

  public cardTypes: CardType[] = [CardType.METAL];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Ram',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: '',
    },
    {
      name: 'Metal Claw',
      cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: '',
    },
  ];

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Lairon';

  public fullName: string = 'Lairon RS';
}
