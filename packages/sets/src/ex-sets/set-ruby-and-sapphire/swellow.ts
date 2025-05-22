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

export class Swellow extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Taillow';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 70;

  public powers = [
    {
      name: 'Drive Off',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), if Swellow is your Active Pokémon, you may switch 1 of the ' +
        'Defending Pokémon with 1 of your opponent\'s Benched Pokémon. Your opponent picks the Benched Pokémon to ' +
        'switch. This power can\'t be used if Swellow is affected by a Special Condition. '
    },
  ];

  public attacks = [
    {
      name: 'Wing Attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'RS';

  public name: string = 'Swellow';

  public fullName: string = 'Swellow RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    return state;
  }
}
