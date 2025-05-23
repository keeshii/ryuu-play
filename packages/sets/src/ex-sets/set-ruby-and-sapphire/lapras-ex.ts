import { AttackEffect, CardTag, CardType, Effect, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class LaprasEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 110;

  public attacks = [
    {
      name: 'Energy Ball',
      cost: [CardType.WATER],
      damage: '10+',
      text:
        'Does 10 damage plus 10 more damage for each Energy attached to Lapras ex but not used to pay for this ' +
        'attack\'s Energy cost. You can\'t add more than 20 damage in this way.',
    },
    {
      name: 'Confuse Ray',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: '30',
      text: 'The Defending Pokémon is now Confused.',
    },
  ];

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Lapras ex';

  public fullName: string = 'Lapras ex RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
