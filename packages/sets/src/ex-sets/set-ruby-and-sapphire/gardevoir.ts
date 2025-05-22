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

export class Gardevoir extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Kirlia';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 100;

  public powers = [
    {
      name: 'Psy Shadow',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may search your deck for a Psychic Energy card and attach ' +
        'it to 1 of your Pokémon. Put 2 damage counters on that Pokémon. Shuffle your deck afterward. This power ' +
        'can\'t be used if Gardevoir is affected by a Special Condition. '
    },
  ];

  public attacks = [
    {
      name: 'Energy Burst',
      cost: [CardType.PSYCHIC],
      damage: '10×',
      text: 'Does 10 damage times the total amount of Energy attached to Gardevoir and the Defending Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Gardevoir';

  public fullName: string = 'Gardevoir RS';

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
