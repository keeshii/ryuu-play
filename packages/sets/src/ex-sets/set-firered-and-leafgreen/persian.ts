import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CheckTableStateEffect,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Persian extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Meowth';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 80;

  public powers = [
    {
      name: 'Thick Skin',
      powerType: PowerType.POKEBODY,
      text: 'Persian can\'t be affected by any Special Conditions.'
    },
  ];

  public attacks = [
    {
      name: 'Poison Claws',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'The Defending Pokémon is now Poisoned.'
    },
    {
      name: 'Shining Claws',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: 'The Defending Pokémon is now Confused.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Persian';

  public fullName: string = 'Persian RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        const conditions = player.active.specialConditions.slice();

        if (player.active.getPokemonCard() !== this || conditions.length === 0) {
          return;
        }

        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const powerEffect = new PowerEffect(player, this.powers[0], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }

        conditions.forEach(condition => {
          player.active.removeSpecialCondition(condition);
        });
      });
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialConditionEffect);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
      return state;
    }

    return state;
  }
}
