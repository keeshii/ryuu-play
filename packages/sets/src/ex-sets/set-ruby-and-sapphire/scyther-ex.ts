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

export class ScytherEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 80;

  public attacks = [
    {
      name: 'Agility',
      cost: [CardType.GRASS],
      damage: '10',
      text:
        'Flip a coin. If heads, prevent all effects of an attack, including damage, done to Scyther ex during your ' +
        'opponent\'s next turn. '
    },
    {
      name: 'Slash',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: '50',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Scyther ex';

  public fullName: string = 'Scyther ex RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
