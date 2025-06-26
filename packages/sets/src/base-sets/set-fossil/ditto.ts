import {
  AfterCheckProvidedEnergyEffect,
  Attack,
  CardType,
  CheckHpEffect,
  CheckPokemonStatsEffect,
  CheckPokemonTypeEffect,
  CheckRetreatCostEffect,
  ChooseAttackPrompt,
  Effect,
  GameError,
  GameMessage,
  PokemonCard,
  PokemonSlot,
  Power,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
  UseAttackEffect,
  UsePowerEffect,
} from '@ptcg/common';

function getTransformedPokemonCard(self: Ditto, store: StoreLike, state: State, target: PokemonSlot): PokemonCard | undefined {
  const power: Power = { powerType: PowerType.POKEPOWER, name: 'Transform', text: '' };
  const player = StateUtils.findOwner(state, target);
  const opponent = StateUtils.getOpponent(state, player);

  if (player.active !== target || target.getPokemonCard() !== self) {
    return undefined;
  }

  if (player.active.specialConditions.includes(SpecialCondition.ASLEEP)
    || player.active.specialConditions.includes(SpecialCondition.CONFUSED)
    || player.active.specialConditions.includes(SpecialCondition.PARALYZED)) {
    return undefined;
  }

  const defending = opponent.active.getPokemonCard();
  if (!defending) {
    return undefined;
  }

  // Try to reduce PowerEffect, to check if something is blocking our ability
  try {
    const powerEffect = new PowerEffect(player, power, self);
    store.reduceEffect(state, powerEffect);
  } catch {
    return undefined;
  }

  return defending;
}

export class Ditto extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 50;

  public powers = [
    {
      name: 'Transform',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'If Ditto is your Active Pokémon, treat it as if it were the same card as the Defending Pokémon, including ' +
        'type, Hit Points, Weakness, and so on, except Ditto can\'t evolve, always has this Pokémon Power, and you ' +
        'may treat any Energy attached to Ditto as Energy of any type. Ditto isn\'t a copy of any other Pokémon ' +
        'while Ditto is Asleep, Confused, or Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Ditto';

  public fullName: string = 'Ditto FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // HP of the Defending Pokemon
    if (effect instanceof CheckHpEffect && effect.target.pokemons.cards.includes(this)) {
      const defending = getTransformedPokemonCard(this, store, state, effect.target);
      if (!defending) {
        return state;
      }
      effect.hp += defending.hp - this.hp;
      return state;
    }

    // Retreat Costs
    if (effect instanceof CheckRetreatCostEffect && effect.player.active.pokemons.cards.includes(this)) {
      const defending = getTransformedPokemonCard(this, store, state, effect.player.active);
      if (!defending) {
        return state;
      }

      // Defending has less retreat
      if (defending.retreat.length < this.retreat.length) {
        // Decrease the effect.cost by that amount of energies
        effect.cost.length = Math.max(0, effect.cost.length - (this.retreat.length - defending.retreat.length));
      } else {
        // defending has equal or greater retreat cost
        for (let i = this.retreat.length; i < defending.retreat.length; i++) {
          // Add that many energies to the retreat cost
          effect.cost.push(defending.retreat[i]);
        }
      }
      return state;
    }

    // Card types
    if (effect instanceof CheckPokemonTypeEffect && effect.target.pokemons.cards.includes(this)) {
      const defending = getTransformedPokemonCard(this, store, state, effect.target);
      if (!defending) {
        return state;
      }
      effect.cardTypes = defending.cardTypes.slice();
      return state;
    }

    // Weakness and Resistance
    if (effect instanceof CheckPokemonStatsEffect && effect.target.pokemons.cards.includes(this)) {
      const defending = getTransformedPokemonCard(this, store, state, effect.target);
      if (!defending) {
        return state;
      }
      effect.resistance = defending.resistance.map(r => ({ type: r.type, value: r.value }));
      effect.weakness = defending.weakness.map(r => ({ type: r.type, value: r.value }));
      return state;
    }

    // Transform attached Energies to Rainbow
    if (effect instanceof AfterCheckProvidedEnergyEffect && effect.source.pokemons.cards.includes(this)) {
      const defending = getTransformedPokemonCard(this, store, state, effect.source);
      if (!defending) {
        return state;
      }
      effect.energyMap.forEach(item => {
        item.provides = item.provides.map(p => CardType.ANY);
      });
    }

    // Allow to copy Attacks and Powers
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      const pokemonCard = getTransformedPokemonCard(this, store, state, effect.player.active);
      if (pokemonCard === undefined) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(
        state,
        new ChooseAttackPrompt(player.id, GameMessage.CHOOSE_ATTACK_TO_COPY, [pokemonCard], {
          allowCancel: true,
          // TODO
          // enableAbility: { useWhenInPlay: true }
        }),
        result => {
          if (result === null) {
            return;
          }
          if (pokemonCard.attacks.includes(result as Attack)) {
            const attack = result as Attack;
            const attackEffect = new UseAttackEffect(player, attack);
            store.reduceEffect(state, attackEffect);
          }
          if (pokemonCard.powers.includes(result as Power)) {
            const power = result as Power;
            const powerEffect = new UsePowerEffect(player, power, this);
            store.reduceEffect(state, powerEffect);
          }
        }
      );
    }

    // TODO
    // Copy passive Abilities

    return state;
  }
}
