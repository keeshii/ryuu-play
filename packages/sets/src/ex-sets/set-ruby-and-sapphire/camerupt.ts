import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Camerupt extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Numel';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 90;

  public attacks = [
    {
      name: 'Lava Burn',
      cost: [CardType.FIRE, CardType.COLORLESS],
      damage: '20',
      text:
        'Choose 1 of your opponent\'s Benched Pokémon. This attack does 10 damage to that Pokémon. (Don\'t apply ' +
        'Weakness and Resistance for Benched Pokémon.) '
    },
    {
      name: 'Fire Spin',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: '100',
      text: 'Discard 2 basic Energy cards attached to Camerupt or this attack does nothing.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Camerupt';

  public fullName: string = 'Camerupt RS';

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
