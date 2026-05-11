import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CheckTableStateEffect,
  Effect,
  GamePhase,
  HealEffect,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
  UseAttackEffect,
} from '@ptcg/common';

export class Snorlax extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 90;

  public powers = [
    {
      name: 'Rest Up',
      powerType: PowerType.POKEBODY,
      text:
        'If Snorlax remains Asleep between turns, remove 2 damage counters from Snorlax (remove 1 if there is only ' +
        '1).'
    },
  ];

  public attacks = [
    {
      name: 'Collapse',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: 'Snorlax is now Asleep.'
    },
    {
      name: 'Toss and Turn',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30+',
      text:
        'If Snorlax is Asleep, this attack does 30 damage plus 30 more damage. (This attack can be used even if ' +
        'Snorlax is Asleep.)'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Snorlax';

  public fullName: string = 'Snorlax RG';

  public readonly TOSS_AND_TURN_MARKER = 'TOSS_AND_TURN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        // Restore Asleep condition after attack (if temporary removed)
        if (player.active.marker.hasMarker(this.TOSS_AND_TURN_MARKER, this)) {
          player.active.marker.removeMarker(this.TOSS_AND_TURN_MARKER, this);
          player.active.addSpecialCondition(SpecialCondition.ASLEEP);
        }

        // Snorlax is not Active
        if (player.active.getPokemonCard() !== this) {
          return;
        }

        // We are interested only when Pokemon remains asleep between turns
        if (state.phase !== GamePhase.BETWEEN_TURNS) {
          return;
        }

        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const powerEffect = new PowerEffect(player, this.powers[0], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }

        // Remains Asleep, heal
        if (player.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
          const healEffect = new HealEffect(player, player.active, 20);
          return store.reduceEffect(state, healEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }

    // Attack can be used even when asleep.
    // Remove the asleep condition and add marker, after the attack restore the condition.
    if (effect instanceof UseAttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      if (player.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
        player.active.marker.addMarker(this.TOSS_AND_TURN_MARKER, this);
        player.active.removeSpecialCondition(SpecialCondition.ASLEEP);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      if (player.active.marker.hasMarker(this.TOSS_AND_TURN_MARKER, this)) {
        effect.damage += 30;
      }
    }

    return state;
  }
}
