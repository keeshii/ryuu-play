import {
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
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Zangoose extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 70;

  public powers = [
    {
      name: 'Poison Resistance',
      powerType: PowerType.POKEBODY,
      text: 'Zangoose can\'t be Poisoned.'
    },
  ];

  public attacks = [
    {
      name: 'Target Slash',
      cost: [CardType.COLORLESS],
      damage: '10+',
      text: 'If the Defending Pokémon is Seviper, this attack does 10 damage plus 30 more damage.'
    },
    {
      name: 'Super Slash',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30+',
      text: 'If the Defending Pokémon is an Evolved Pokémon, this attack does 30 damage plus 30 more damage.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Zangoose';

  public fullName: string = 'Zangoose SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckTableStateEffect) {
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);
      if (!pokemonSlot) {
        return state;
      }

      const player = StateUtils.findOwner(state, pokemonSlot);
      if (player.active !== pokemonSlot || !pokemonSlot.specialConditions.includes(SpecialCondition.POISONED)) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      player.active.removeSpecialCondition(SpecialCondition.POISONED);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const defending = opponent.active.getPokemonCard();
      if (defending && defending.name === 'Seviper') {
        effect.damage += 30;
      }
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.pokemons.cards.length > 1) {
        effect.damage += 30;
      }
    }

    return state;
  }
}
