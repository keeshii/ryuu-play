import {
  AddSpecialConditionsEffect,
  AttackEffect,
  BetweenTurnsEffect,
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Rapidash extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Ponyta';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 80;

  public powers = [
    {
      name: 'Fiery Aura',
      powerType: PowerType.POKEBODY,
      text:
        'As long as Rapidash is your Active Pokémon, put 4 damage counters instead of 2 on Burned Pokémon between ' +
        'turns.'
    },
  ];

  public attacks = [
    {
      name: 'Searing Flame',
      cost: [CardType.FIRE, CardType.COLORLESS],
      damage: '10',
      text: 'The Defending Pokémon is now Burned.'
    },
    {
      name: 'Rear Kick',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Rapidash';

  public fullName: string = 'Rapidash RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof BetweenTurnsEffect) {
      state.players.forEach(player => {
        if (player.active.getPokemonCard() !== this) {
          return;
        }

        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const powerEffect = new PowerEffect(player, this.powers[0], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }

        effect.burnDamage = 40;
      });
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}
