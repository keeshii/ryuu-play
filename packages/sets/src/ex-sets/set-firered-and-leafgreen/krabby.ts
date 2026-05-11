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

export class Krabby extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Irongrip',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
    {
      name: 'Nap',
      cost: [CardType.WATER],
      damage: '',
      text: 'Remove 2 damage counters from Krabby (remove 1 if there is only 1).'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Krabby';

  public fullName: string = 'Krabby RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const healEffect = new HealTargetEffect(effect, 20);
      healEffect.target = player.active;
      return store.reduceEffect(state, healEffect);
    }

    return state;
  }
}
