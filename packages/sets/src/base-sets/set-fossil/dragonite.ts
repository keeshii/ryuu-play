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

export class Dragonite extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Dragonair';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 100;

  public powers = [
    {
      name: 'Step In',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), if Dragonite is on your Bench, you may switch it with your ' +
        'Active Pokémon.'
    },
  ];

  public attacks = [
    {
      name: 'Slam',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40×',
      text: 'Flip 2 coins. This attack does 40 damage times the number of heads.'
    },
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Dragonite';

  public fullName: string = 'Dragonite FO';

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
