import {
  AttackEffect,
  CardTag,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class RaichuEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pikachu';

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 100;

  public attacks = [
    {
      name: 'Dazzle Blast',
      cost: [CardType.LIGHTNING],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
    },
    {
      name: 'Mega Thunderbolt',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: '120',
      text: 'Discard all Energy cards attached to Raichu ex.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Raichu ex';

  public fullName: string = 'Raichu ex SS';

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
