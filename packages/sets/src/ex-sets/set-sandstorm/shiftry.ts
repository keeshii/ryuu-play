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

export class Shiftry extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Nuzleaf';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 120;

  public powers = [
    {
      name: 'Fan Away',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may flip a coin. If heads, return 1 Energy card attached ' +
        'to the Defending Pokémon to your opponent\'s hand. This power can\'t be used if Shiftry is affected by a ' +
        'Special Condition.'
    },
  ];

  public attacks = [
    {
      name: 'Light Touch Throw',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '80-',
      text: 'Does 80 damage minus 10 damage for each Energy attached to the Defending Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Shiftry';

  public fullName: string = 'Shiftry SS';

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
