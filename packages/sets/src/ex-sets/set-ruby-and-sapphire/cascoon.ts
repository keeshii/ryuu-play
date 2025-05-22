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

export class Cascoon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Wurmple';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 70;

  public powers = [
    {
      name: 'Hard Cocoon',
      powerType: PowerType.POKEBODY,
      text:
        'During your opponent\'s turn, if Cascoon would be damaged by an opponent\'s attack (after applying Weakness ' +
        'and Resistance), flip a coin. If heads, reduce that damage by 30. '
    },
  ];

  public attacks = [
    {
      name: 'Poison Thread',
      cost: [CardType.GRASS],
      damage: '',
      text: 'The Defending Pokémon is now Poisoned.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Cascoon';

  public fullName: string = 'Cascoon RS';

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
