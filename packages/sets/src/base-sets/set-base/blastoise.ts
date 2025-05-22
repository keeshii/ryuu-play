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

export class Blastoise extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Wartortle';

  public cardType: CardType = CardType.WATER;

  public hp: number = 100;

  public powers = [
    {
      name: 'Rain Dance',
      powerType: PowerType.POKEPOWER,
      text:
        'As often as you like during your turn (before your attack), you may attach 1 Water Energy card to 1 of ' +
        'your Water Pokémon. (This doesn\'t use up your 1 Energy card attachment for the turn.) This power can\'t be ' +
        'used if Blastoise is Asleep, Confused, or Paralyzed. '
    },
  ];

  public attacks = [
    {
      name: 'Hydro Pump',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER],
      damage: '40+',
      text:
        'Does 40 damage plus 10 more damage for each Water Energy attached to Blastoise but not used to pay for ' +
        'this attack\'s Energy cost. Extra Water Energy after the 2nd doesn\'t count. '
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Blastoise';

  public fullName: string = 'Blastoise BS';

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
