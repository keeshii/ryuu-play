import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Marshtomp2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Mudkip';

  public cardType: CardType = CardType.WATER;

  public hp: number = 80;

  public powers = [
    {
      name: 'Natural Cure',
      powerType: PowerType.POKEBODY,
      text:
        'When you attach a Water Energy card from your hand to Marshtomp, remove all Special Conditions from ' +
        'Marshtomp.',
    },
  ];

  public attacks = [
    {
      name: 'Aqua Sonic',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: 'This attack\'s damage is not affected by Resistance.',
    },
  ];

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Marshtomp';

  public fullName: string = 'Marshtomp RS-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
