import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Marowak extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Cubone';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Bonemerang',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: '30×',
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
    },
    {
      name: 'Call for Friend',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for a F Basic Pokémon card and put it onto your Bench. Shuffle your deck afterward. (You ' +
        'can\'t use this attack if your Bench is full.)'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public resistance = [
    { type: CardType.LIGHTNING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Marowak';

  public fullName: string = 'Marowak JU';

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
