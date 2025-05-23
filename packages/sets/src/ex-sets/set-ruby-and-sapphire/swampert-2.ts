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

export class Swampert2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Marshtomp';

  public cardType: CardType = CardType.WATER;

  public hp: number = 100;

  public powers = [
    {
      name: 'Natural Remedy',
      powerType: PowerType.POKEBODY,
      text:
        'Once during your turn (before your attack), when you attach a Water Energy card from your hand to ' +
        'Swampert, remove 1 damage counter from Swampert.',
    },
  ];

  public attacks = [
    {
      name: 'Water Arrow',
      cost: [CardType.WATER],
      damage: '',
      text:
        'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage to that Pokémon. (Don\'t apply Weakness and ' +
        'Resistance for Benched Pokémon.)',
    },
    {
      name: 'Waterfall',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: '',
    },
  ];

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Swampert';

  public fullName: string = 'Swampert RS-2';

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
