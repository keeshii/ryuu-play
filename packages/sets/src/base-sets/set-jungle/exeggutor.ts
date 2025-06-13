import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Exeggutor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Exeggcute';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Teleport',
      cost: [CardType.PSYCHIC],
      damage: '',
      text: 'Switch Exeggutor with 1 of your Benched Pokémon.'
    },
    {
      name: 'Big Eggsplosion',
      cost: [CardType.COLORLESS],
      damage: '20×',
      text:
        'Flip a number of coins equal to the number of Energy attached to Exeggutor. This attack does 20 damage ' +
        'times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Exeggutor';

  public fullName: string = 'Exeggutor JU';

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
