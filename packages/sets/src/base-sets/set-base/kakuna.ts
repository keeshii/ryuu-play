import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Kakuna extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Weedle';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 80;

  public attacks = [
    {
      name: 'Stiffen',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, prevent all damage done to Kakuna during your opponent\'s next turn. (Any other ' +
        'effects of attacks still happen.) '
    },
    {
      name: 'Poisonpowder',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Kakuna';

  public fullName: string = 'Kakuna BS';

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
