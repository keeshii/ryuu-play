import {
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Grovyle2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Treecko';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 80;

  public powers = [
    {
      name: 'Natural Cure',
      powerType: PowerType.POKEBODY,
      text:
        'When you attach a Grass Energy card from your hand to Grovyle, remove all Special Conditions from Grovyle. '
    },
  ];

  public attacks = [
    {
      name: 'Slash',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public resistance = [
    { type: CardType.WATER, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Grovyle';

  public fullName: string = 'Grovyle RS-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    return state;
  }
}
