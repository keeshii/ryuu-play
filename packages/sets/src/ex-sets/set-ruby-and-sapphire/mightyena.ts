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

export class Mightyena extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Poochyena';

  public cardType: CardType = CardType.DARK;

  public hp: number = 70;

  public powers = [
    {
      name: 'Intimidating Fang',
      powerType: PowerType.POKEBODY,
      text:
        'As long as Mightyena is your Active Pokémon, any damage done to your Pokémon by an opponent\'s attack is ' +
        'reduced by 10 (before applying Weakness and Resistance). '
    },
  ];

  public attacks = [
    {
      name: 'Shakedown',
      cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: 'Flip a coin. If heads, choose 1 card from your opponent\'s hand without looking and discard it.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Mightyena';

  public fullName: string = 'Mightyena RS';

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
