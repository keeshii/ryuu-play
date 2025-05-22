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

export class Combusken2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Torchic';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 80;

  public powers = [
    {
      name: 'Natural Cure',
      powerType: PowerType.POKEBODY,
      text:
        'When you attach a Fire Energy card from your hand to Combusken, remove all Special Conditions from ' +
        'Combusken. '
    },
  ];

  public attacks = [
    {
      name: 'Lunge',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: 'Flip a coin. If tails, this attack does nothing.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Combusken';

  public fullName: string = 'Combusken RS-2';

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
