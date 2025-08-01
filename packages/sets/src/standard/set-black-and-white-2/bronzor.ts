import { CardType, PokemonCard, Stage } from '@ptcg/common';

export class Bronzor extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.METAL];

  public hp: number = 50;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Tackle',
      cost: [CardType.METAL],
      damage: '10',
      text: '',
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Bronzor';

  public fullName: string = 'Bronzor PFO';
}
