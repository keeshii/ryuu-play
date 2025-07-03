import {
  AttackEffect,
  CardType,
  Effect,
  HealTargetEffect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Lotad2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Tackle',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
    {
      name: 'Blot',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: 'Remove 1 damage counter from Lotad.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Lotad';

  public fullName: string = 'Lotad SS-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const healEffect = new HealTargetEffect(effect, 10);
      healEffect.target = player.active;
      return store.reduceEffect(state, healEffect);
    }

    return state;
  }
}
