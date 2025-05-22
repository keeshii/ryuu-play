import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Silcoon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Wurmple';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 60;

  public powers = [
    {
      name: 'Hard Cocoon',
      powerType: PowerType.POKEBODY,
      text:
        'During your opponent\'s turn, if Silcoon would be damaged by an opponent\'s attack (after applying Weakness ' +
        'and Resistance), flip a coin. If heads, reduce that damage by 30. '
    },
  ];

  public attacks = [
    {
      name: 'Gooey Thread',
      cost: [CardType.GRASS],
      damage: '10',
      text: 'The Defending Pokémon can\'t retreat until the end of your opponent\'s next turn.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Silcoon';

  public fullName: string = 'Silcoon RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
