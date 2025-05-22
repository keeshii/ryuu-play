import { CardType, PokemonCard, Stage } from '@ptcg/common';

export class Charmander2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 70;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    { name: 'Gnaw', cost: [CardType.FIRE], damage: '10', text: '' },
    {
      name: 'Flare',
      cost: [CardType.FIRE, CardType.COLORLESS],
      damage: '20',
      text: '',
    },
  ];

  public set: string = 'SSH';

  public name: string = 'Charmander';

  public fullName: string = 'Charmander PSSH';
}
