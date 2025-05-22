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

export class Alakazam extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Kadabra';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 80;

  public powers = [
    {
      name: 'Damage Swap',
      powerType: PowerType.POKEPOWER,
      text:
        'As often as you like during your turn (before your attack), you may move 1 damage counter from 1 of your ' +
        'Pokémon to another as long as you don\'t Knock Out that Pokémon. This power can\'t be used if Alakazam is ' +
        'Asleep, Confused, or Paralyzed. '
    },
  ];

  public attacks = [
    {
      name: 'Confuse Ray',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.PSYCHIC],
      damage: '30',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Alakazam';

  public fullName: string = 'Alakazam BS';

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
