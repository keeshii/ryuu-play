import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Azumarill extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Marill';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Drizzle',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'If you have W Energy cards in your hand, attach as many W Energy cards as you like to any of your Active ' +
        'Pokémon.'
    },
    {
      name: 'Max Bubbles',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: '30×',
      text:
        'Flip a coin for each Energy attached to all of your Active Pokémon. This attack does 30 damage times the ' +
        'number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Azumarill';

  public fullName: string = 'Azumarill SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
