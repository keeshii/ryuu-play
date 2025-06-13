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

export class Vileplume extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Gloom';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 80;

  public powers = [
    {
      name: 'Heal',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may flip a coin. If heads, remove 1 damage counter from 1 ' +
        'of your Pokémon. This power can\'t be used if Vileplume is Asleep, Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Petal Dance',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS],
      damage: '40×',
      text:
        'Flip 3 coins. This attack does 40 damage times the number of heads. Vileplume is now Confused (after doing ' +
        'damage).'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Vileplume';

  public fullName: string = 'Vileplume JU';

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
