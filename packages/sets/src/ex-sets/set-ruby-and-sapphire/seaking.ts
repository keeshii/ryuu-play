import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Seaking extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Goldeen';

  public cardType: CardType = CardType.WATER;

  public hp: number = 70;

  public attacks = [
    {
      name: 'Water Arrow',
      cost: [CardType.WATER],
      damage: '',
      text:
        'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage to that Pokémon. (Don\'t apply Weakness and ' +
        'Resistance for Benched Pokémon.) '
    },
    {
      name: 'Fast Stream',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text:
        'Move 1 Energy card attached to the Defending Pokémon to the other Defending Pokémon. (Ignore this effect ' +
        'if your opponent has only 1 Defending Pokémon.) '
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [];

  public set: string = 'RS';

  public name: string = 'Seaking';

  public fullName: string = 'Seaking RS';

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
