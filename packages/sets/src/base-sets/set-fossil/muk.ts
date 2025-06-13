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

export class Muk extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Grimer';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 70;

  public powers = [
    {
      name: 'Toxic Gas',
      powerType: PowerType.POKEPOWER,
      text:
        'Ignore all Pokémon Powers other than Toxic Gases. This power stops working while Muk is Asleep, Confused, ' +
        'or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Sludge',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS],
      damage: '30',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Muk';

  public fullName: string = 'Muk FO';

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
