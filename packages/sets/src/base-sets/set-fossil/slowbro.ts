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

export class Slowbro extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Slowpoke';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 60;

  public powers = [
    {
      name: 'Strange Behavior',
      powerType: PowerType.POKEPOWER,
      text:
        'As often as you like during your turn (before your attack), you may move 1 damage counter from 1 of your ' +
        'Pokémon to Slowbro as long as you don\'t Knock Out Slowbro. This power can\'t be used if Slowbro is Asleep, ' +
        'Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Psyshock',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Slowbro';

  public fullName: string = 'Slowbro FO';

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
