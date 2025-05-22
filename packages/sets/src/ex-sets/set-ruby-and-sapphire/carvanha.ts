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

export class Carvanha extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 40;

  public powers = [
    {
      name: 'Rough Skin',
      powerType: PowerType.POKEBODY,
      text:
        'If Carvanha is your Active Pokémon and is damaged by an opponent\'s attack (even if Carvanha is Knocked ' +
        'Out), put 1 damage counter on the Attacking Pokémon. '
    },
  ];

  public attacks = [
    {
      name: 'Big Bite',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: 'The Defending Pokémon can\'t retreat until the end of your opponent\'s next turn.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Carvanha';

  public fullName: string = 'Carvanha RS';

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
