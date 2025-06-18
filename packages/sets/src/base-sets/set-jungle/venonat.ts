import {
  AddSpecialConditionsEffect,
  AfterDamageEffect,
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  HealTargetEffect,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Venonat extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Stun Spore',
      cost: [CardType.GRASS],
      damage: '10',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Leech Life',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: '10',
      text:
        'Remove a number of damage counters from Venonat equal to the damage done to the Defending Pokémon (after ' +
        'applying Weakness and Resistance).'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Venonat';

  public fullName: string = 'Venonat JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (effect instanceof AfterDamageEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const healEffect = new HealTargetEffect(effect.attackEffect, effect.damage);
      healEffect.target = player.active;
      store.reduceEffect(state, healEffect);
    }

    return state;
  }
}
