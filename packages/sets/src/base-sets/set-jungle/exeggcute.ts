import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Exeggcute extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Hypnosis',
      cost: [CardType.PSYCHIC],
      damage: '',
      text: 'The Defending Pokémon is now Asleep.'
    },
    {
      name: 'Leech Seed',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '20',
      text: 'Unless all damage from this attack is prevented, you may remove 1 damage counter from Exeggcute.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Exeggcute';

  public fullName: string = 'Exeggcute JU';

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
