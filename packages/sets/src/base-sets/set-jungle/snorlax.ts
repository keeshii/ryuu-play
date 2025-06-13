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

export class Snorlax extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 90;

  public powers = [
    {
      name: 'Thick Skinned',
      powerType: PowerType.POKEPOWER,
      text:
        'Snorlax can\'t become Asleep, Confused, Paralyzed, or Poisoned. This power can\'t be used if Snorlax is ' +
        'already Asleep, Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Body Slam',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Snorlax';

  public fullName: string = 'Snorlax JU';

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
