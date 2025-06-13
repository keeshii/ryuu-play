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

export class Haunter extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Gastly';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 50;

  public powers = [
    {
      name: 'Transparency',
      powerType: PowerType.POKEPOWER,
      text:
        'Whenever an attack does anything to Haunter, flip a coin. If heads, prevent all effects of that attack, ' +
        'including damage, done to Haunter. This power stops working while Haunter is Asleep, Confused, or ' +
        'Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Nightmare',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '10',
      text: 'The Defending Pokémon is now Asleep.'
    },
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'FO';

  public name: string = 'Haunter';

  public fullName: string = 'Haunter FO';

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
