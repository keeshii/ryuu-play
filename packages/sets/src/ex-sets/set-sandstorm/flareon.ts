import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Flareon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Super Singe',
      cost: [CardType.FIRE, CardType.COLORLESS],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Burned.'
    },
    {
      name: 'Flamethrower',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '70',
      text: 'Discard a R Energy card attached to Flareon.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Flareon';

  public fullName: string = 'Flareon SS';

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
