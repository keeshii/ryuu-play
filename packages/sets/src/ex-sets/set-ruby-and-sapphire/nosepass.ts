import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Nosepass extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 60;

  public attacks = [
    {
      name: 'Invisible Hand',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'If any of your opponent\'s Active Pokémon are Evolved Pokémon, search your deck for any 1 card and put it ' +
        'into your hand. Shuffle your deck afterward. '
    },
    {
      name: 'Repulsion',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, your opponent returns the Defending Pokémon and all cards attached to it to his or ' +
        'her hand. (If your opponent doesn\'t have any Benched Pokémon or other Active Pokémon, this attack does ' +
        'nothing.) '
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Nosepass';

  public fullName: string = 'Nosepass RS';

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
