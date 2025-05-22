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

export class Beautifly extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Silcoon';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 80;

  public powers = [
    {
      name: 'Withering Dust',
      powerType: PowerType.POKEBODY,
      text: 'As long as Beautifly is in play, do not apply Resistance for all Active Pokémon.'
    },
  ];

  public attacks = [
    {
      name: 'Stun Spore',
      cost: [CardType.GRASS],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Parallel Gain',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: 'Remove 1 damage counter from each of your Pokémon, including Beautifly.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [];

  public set: string = 'RS';

  public name: string = 'Beautifly';

  public fullName: string = 'Beautifly RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
