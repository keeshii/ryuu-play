import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Gloom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Oddish';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Poisonpowder',
      cost: [CardType.GRASS],
      damage: '',
      text: 'The Defending Pokémon is now Poisoned.'
    },
    {
      name: 'Foul Odor',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '20',
      text: 'Both the Defending Pokémon and Gloom are now Confused (after doing damage).'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Gloom';

  public fullName: string = 'Gloom JU';

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
