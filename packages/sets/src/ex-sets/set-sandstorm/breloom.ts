import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Breloom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Shroomish';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Super Poison Breath',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Each Defending Pokémon is now Poisoned.'
    },
    {
      name: 'Sky Uppercut',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: 'This attack\'s damage is not affected by Resistance.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Breloom';

  public fullName: string = 'Breloom SS';

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
