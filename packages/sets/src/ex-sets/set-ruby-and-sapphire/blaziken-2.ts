import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Blaziken2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Combusken';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 110;

  public attacks = [
    {
      name: 'Clutch',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: 'The Defending Pokémon can\'t retreat until the end of your opponent\'s next turn.'
    },
    {
      name: 'Flamethrower',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '80',
      text: 'Discard a Fire Energy card attached to Blaziken.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Blaziken';

  public fullName: string = 'Blaziken RS-2';

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
