import {
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Aerodactyl extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Mysterious Fossil';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 60;

  public powers = [
    {
      name: 'Prehistoric Power',
      powerType: PowerType.POKEPOWER,
      text:
        'No more Evolution cards can be played. This power stops working while Aerodactyl is Asleep, Confused, or ' +
        'Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Wing Attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Aerodactyl';

  public fullName: string = 'Aerodactyl FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    return state;
  }
}
