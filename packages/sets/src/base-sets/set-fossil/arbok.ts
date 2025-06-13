import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Arbok extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Ekans';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Terror Strike',
      cost: [CardType.GRASS],
      damage: '10',
      text:
        'Flip a coin. If heads and if your opponent has any Benched Pokémon, he or she chooses 1 of them and ' +
        'switches it with the Defending Pokémon. (Do the damage before switching the Pokémon.)'
    },
    {
      name: 'Poison Fang',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: '20',
      text: 'The Defending Pokémon is now Poisoned.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Arbok';

  public fullName: string = 'Arbok FO';

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
