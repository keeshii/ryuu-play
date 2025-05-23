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

export class Swampert extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Marshtomp';

  public cardType: CardType = CardType.WATER;

  public hp: number = 110;

  public powers = [
    {
      name: 'Water Call',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may attach a Water Energy card from your hand to your ' +
        'Active Pokémon. This power can\'t be used if Swampert is affected by a Special Condition.',
    },
  ];

  public attacks = [
    {
      name: 'Hypno Splash',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: 'The Defending Pokémon is now Asleep.',
    },
  ];

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Swampert';

  public fullName: string = 'Swampert RS';

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
