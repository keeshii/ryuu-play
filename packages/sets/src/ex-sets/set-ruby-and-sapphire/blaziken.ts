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

export class Blaziken extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Combusken';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 100;

  public powers = [
    {
      name: 'Firestarter',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may attach a Fire Energy card from your discard pile to 1 ' +
        'of your Benched Pokémon. This power can\'t be used if Blaziken is affected by a Special Condition. '
    },
  ];

  public attacks = [
    {
      name: 'Fire Stream',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text:
        'Discard a Fire Energy card attached to Blaziken. If you do, this attack does 10 damage to each of your ' +
        'opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) '
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Blaziken';

  public fullName: string = 'Blaziken RS';

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
