import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Ninetales extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Vulpix';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 80;

  public attacks = [
    {
      name: 'Lure',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text: 'If your opponent has any Benched Pokémon, choose 1 of them and switch it with his or her Active Pokémon.'
    },
    {
      name: 'Fire Blast',
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE],
      damage: '80',
      text: 'Discard 1 Fire Energy card attached to Ninetales in order to use this attack.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Ninetales';

  public fullName: string = 'Ninetales BS';

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
