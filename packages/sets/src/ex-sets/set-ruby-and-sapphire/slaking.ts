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

export class Slaking extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Vigoroth';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 120;

  public powers = [
    {
      name: 'Lazy',
      powerType: PowerType.POKEBODY,
      text: 'As long as Slaking is your Active Pokémon, your opponent\'s Pokémon can\'t use any Poké-Powers.'
    },
  ];

  public attacks = [
    {
      name: 'Critical Move',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '100',
      text:
        'Discard a basic Energy card attached to Slaking or this attack does nothing. Slaking can\'t attack during ' +
        'your next turn. '
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Slaking';

  public fullName: string = 'Slaking RS';

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
