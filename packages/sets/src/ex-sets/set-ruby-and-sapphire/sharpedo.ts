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

export class Sharpedo extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Carvanha';

  public cardType: CardType = CardType.WATER;

  public hp: number = 70;

  public powers = [
    {
      name: 'Rough Skin',
      powerType: PowerType.POKEBODY,
      text:
        'If Sharpedo is your Active Pokémon and is damaged by an opponent\'s attack (even if Sharpedo is Knocked ' +
        'Out), put 2 damage counters on the Attacking Pokémon.',
    },
  ];

  public attacks = [
    {
      name: 'Dark Slash',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40+',
      text:
        'You may discard a Darkness Energy card attached to Sharpedo. If you do, this attack does 40 damage plus 30 ' +
        'more damage.',
    },
  ];

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Sharpedo';

  public fullName: string = 'Sharpedo RS';

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
