import {
  AddSpecialConditionsEffect,
  AfterDamageEffect,
  AttackEffect,
  CardType,
  Effect,
  HealTargetEffect,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Exeggcute extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Hypnosis',
      cost: [CardType.PSYCHIC],
      damage: '',
      text: 'The Defending Pokémon is now Asleep.'
    },
    {
      name: 'Leech Seed',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '20',
      text: 'Unless all damage from this attack is prevented, you may remove 1 damage counter from Exeggcute.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Exeggcute';

  public fullName: string = 'Exeggcute JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof AfterDamageEffect && effect.attack === this.attacks[1] && effect.damage > 0) {
      const player = effect.player;
      const healEffect = new HealTargetEffect(effect.attackEffect, 10);
      healEffect.target = player.active;
      store.reduceEffect(state, healEffect);
    }

    return state;
  }
}
