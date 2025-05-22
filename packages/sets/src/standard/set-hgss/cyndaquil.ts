import { CardType, PokemonCard, Stage } from '@ptcg/common';

export class Cyndaquil extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 60;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    { name: 'Beat', cost: [CardType.FIRE], damage: '10', text: '' },
    {
      name: 'Flare',
      cost: [CardType.FIRE, CardType.COLORLESS],
      damage: '20',
      text: '',
    },
  ];

  public set: string = 'HGSS';

  public name: string = 'Cyndaquil';

  public fullName: string = 'Cyndaquil HGSS';
}
