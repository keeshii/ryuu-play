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

export class Sceptile2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Grovyle';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 100;

  public powers = [
    {
      name: 'Energy Trans',
      powerType: PowerType.POKEPOWER,
      text:
        'As often as you like during your turn (before your attack), move a Grass Energy card attached to 1 of your ' +
        'Pokémon to another of your Pokémon. This power can\'t be used if Sceptile is affected by a Special ' +
        'Condition.',
    },
  ];

  public attacks = [
    {
      name: 'Tail Rap',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50×',
      text: 'Flip 2 coins. This attack does 50 damage times the number of heads.',
    },
  ];

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.WATER, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Sceptile';

  public fullName: string = 'Sceptile RS-2';

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
