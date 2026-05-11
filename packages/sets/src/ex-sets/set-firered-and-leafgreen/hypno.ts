import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CheckTableStateEffect,
  Effect,
  GamePhase,
  PokemonCard,
  PokemonSlot,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Hypno extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Drowzee';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 80;

  public powers = [
    {
      name: 'Eerie Aura',
      powerType: PowerType.POKEBODY,
      text:
        'As long as Hypno is your Active Pokémon, put 2 damage counters on each Pokémon that remains Asleep between ' +
        'turns.'
    },
  ];

  public attacks = [
    {
      name: 'Hypnotic Ray',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '20',
      text: 'The Defending Pokémon is now Asleep.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Hypno';

  public fullName: string = 'Hypno RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        const opponent = StateUtils.getOpponent(state, player);
        const targets: PokemonSlot[] = [];

        // Hypno is not Active
        if (player.active.getPokemonCard() !== this) {
          return;
        }

        // We are interested only when Pokemon remains asleep between turns
        if (state.phase !== GamePhase.BETWEEN_TURNS) {
          return;
        }

        if (player.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
          targets.push(player.active);
        }

        if (opponent.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
          targets.push(opponent.active);
        }

        // Noone remains asleep
        if (targets.length === 0) {
          return;
        }

        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const powerEffect = new PowerEffect(player, this.powers[0], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }

        for (const target of targets) {
          target.damage += 20;
        }
      });

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}
