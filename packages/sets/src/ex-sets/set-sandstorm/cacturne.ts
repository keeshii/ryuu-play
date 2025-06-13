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

export class Cacturne extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Cacnea';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 80;

  public powers = [
    {
      name: 'Poison Payback',
      powerType: PowerType.POKEBODY,
      text:
        'If Cacturne is your Active Pokémon and is damaged by an opponent\'s attack (even if Cacturne is Knocked ' +
        'Out), the Attacking Pokémon is now Poisoned.'
    },
  ];

  public attacks = [
    {
      name: 'Feint Attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Choose 1 of your opponent\'s Pokémon. This attack does 40 damage to that Pokémon. This attack\'s damage ' +
        'isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies or any other effects on that Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Cacturne';

  public fullName: string = 'Cacturne SS';

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
