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

export class MrMime extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 40;

  public powers = [
    {
      name: 'Invisible Wall',
      powerType: PowerType.POKEPOWER,
      text:
        'Whenever an attack (including your own) does 30 or more damage to Mr. Mime (after applying Weakness and ' +
        'Resistance), prevent that damage. (Any other effects of attacks still happen.) This power can\'t be used if ' +
        'Mr. Mime is Asleep, Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Meditate',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '10+',
      text: 'Does 10 damage plus 10 more damage for each damage counter on the Defending Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Mr. Mime';

  public fullName: string = 'Mr. Mime JU';

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
