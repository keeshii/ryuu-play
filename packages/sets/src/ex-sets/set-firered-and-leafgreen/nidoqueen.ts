import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CheckRetreatCostEffect,
  Effect,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Nidoqueen extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Nidorina';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 120;

  public powers = [
    {
      name: 'Family Bonds',
      powerType: PowerType.POKEBODY,
      text:
        'As long as Nidoqueen is in play, the Retreat Cost for Nidoran Female, Nidorina, Nidoran Male, Nidorino and ' +
        'Nidoking is 0.'
    },
  ];

  public attacks = [
    {
      name: 'Toxic',
      cost: [CardType.GRASS],
      damage: '',
      text:
        'The Defending Pokémon is now Poisoned. Put 2 damage counters instead of 1 on the Defending Pokémon between ' +
        'turns.'
    },
    {
      name: 'Power Lariat',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40+',
      text: 'Does 40 damage plus 10 more damage for each Evolved Pokémon you have in play.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Nidoqueen';

  public fullName: string = 'Nidoqueen RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // errata: Retreat Cost for [...] you have in play is 0.
    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;

      let isNidoqueenInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, pokemonCard) => {
        if (pokemonCard === this) {
          isNidoqueenInPlay = true;
        }
      });

      if (!isNidoqueenInPlay) {
        return state;
      }

      const pokemonCard = player.active.getPokemonCard();
      const names = ['Nidoran Female', 'Nidorina', 'Nidoran Male', 'Nidorino', 'Nidoking'];

      if (!pokemonCard || !names.includes(pokemonCard.name)) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.cost = [];
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      specialCondition.poisonDamage = 20;
      return store.reduceEffect(state, specialCondition);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      let evolvedPokemons = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, pokemonCard) => {
        if (pokemonSlot.isEvolved()) {
          evolvedPokemons += 1;
        }
      });

      effect.damage += evolvedPokemons * 10;
    }

    return state;
  }
}
