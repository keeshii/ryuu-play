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

export class Azurill extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 40;

  public powers = [
    {
      name: 'Baby Evolution',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may put Marill from your hand onto Azurill (this counts as ' +
        'evolving Azurill), and remove all damage counters from Azurill.'
    },
  ];

  public attacks = [
    {
      name: 'Jump Catch',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for a Trainer card, show it to your opponent, and put it into your hand. Shuffle your ' +
        'deck afterward.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Azurill';

  public fullName: string = 'Azurill SS';

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
