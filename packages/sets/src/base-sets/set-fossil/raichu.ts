import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Raichu extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pikachu';

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 90;

  public attacks = [
    {
      name: 'Gigashock',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING],
      damage: '30',
      text:
        'Choose 3 of your opponent\'s Benched Pokémon and this attack does 10 damage to each of them. (Don\'t apply ' +
        'Weakness and Resistance for Benched Pokémon.) If your opponent has fewer than 3 Benched Pokémon, do the ' +
        'damage to each of them.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Raichu';

  public fullName: string = 'Raichu FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
