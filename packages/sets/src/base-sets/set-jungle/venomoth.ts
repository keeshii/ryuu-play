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

export class Venomoth extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Venonat';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 70;

  public powers = [
    {
      name: 'Shift',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may change the type of Venomoth to the type of any other ' +
        'Pokémon in play other than C. This power can\'t be used if Venomoth is Asleep, Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Venom Powder',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '10',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused and Poisoned.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'JU';

  public name: string = 'Venomoth';

  public fullName: string = 'Venomoth JU';

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
