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

export class Machamp extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Machoke';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 100;

  public powers = [
    {
      name: 'Strikes Back',
      powerType: PowerType.POKEPOWER,
      text:
        'Whenever your opponent\'s attack damages Machamp (even if Machamp is Knocked Out), this power does 10 ' +
        'damage to the attacking Pokémon. (Don\'t apply Weakness and Resistance.) This power can\'t be used if ' +
        'Machamp is Asleep, Confused, or Paralyzed when your opponent attacks. '
    },
  ];

  public attacks = [
    {
      name: 'Seismic Toss',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: '60',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Machamp';

  public fullName: string = 'Machamp BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    return state;
  }
}
