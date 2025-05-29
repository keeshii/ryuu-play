import {
  AfterDamageEffect,
  CardType,
  Effect,
  HealTargetEffect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Bulbasaur extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 40;

  public attacks = [
    {
      name: 'Leech Seed',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '20',
      text: 'Unless all damage from this attack is prevented, you may remove 1 damage counter from Bulbasaur.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Bulbasaur';

  public fullName: string = 'Bulbasaur BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterDamageEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (effect.damage > 0) {
        const healEffect = new HealTargetEffect(effect.attackEffect, 10);
        healEffect.target = player.active;
        store.reduceEffect(state, healEffect);
      }
    }

    return state;
  }
}
