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

export class Venusaur extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Ivysaur';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 100;

  public powers = [
    {
      name: 'Energy Trans',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'As often as you like during your turn (before your attack), you may take 1 Grass Energy card attached to 1 ' +
        'of your Pokémon and attach it to a different one. This power can\'t be used if Venusaur is Asleep, ' +
        'Confused, or Paralyzed. '
    },
  ];

  public attacks = [
    {
      name: 'Solarbeam',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS, CardType.GRASS],
      damage: '60',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Venusaur';

  public fullName: string = 'Venusaur BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    return state;
  }
}
