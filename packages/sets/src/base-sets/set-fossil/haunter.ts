import {
  AbstractAttackEffect,
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  EndTurnEffect,
  GameMessage,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
  UseAttackEffect,
} from '@ptcg/common';

export class Haunter extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Gastly';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 50;

  public powers = [
    {
      name: 'Transparency',
      powerType: PowerType.POKEPOWER,
      text:
        'Whenever an attack does anything to Haunter, flip a coin. If heads, prevent all effects of that attack, ' +
        'including damage, done to Haunter. This power stops working while Haunter is Asleep, Confused, or ' +
        'Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Nightmare',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '10',
      text: 'The Defending Pokémon is now Asleep.'
    },
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'FO';

  public name: string = 'Haunter';

  public fullName: string = 'Haunter FO';

  public readonly TRANSPARENCY_SUCCESS_MARKER = 'TRANSPARENCY_SUCCESS_MARKER';

  public readonly TRANSPARENCY_FAIL_MARKER = 'TRANSPARENCY_FAIL_MARKER';

  public readonly CLEAR_TRANSPARENCY_MARKER = 'CLEAR_TRANSPARENCY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseAttackEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (pokemonSlot === undefined
        || pokemonSlot.specialConditions.includes(SpecialCondition.ASLEEP)
        || pokemonSlot.specialConditions.includes(SpecialCondition.CONFUSED)
        || pokemonSlot.specialConditions.includes(SpecialCondition.PARALYZED)) {
        return state;
      }

      // Not an attack, or defending is not Haunter
      if (pokemonSlot !== opponent.active
        || pokemonSlot.getPokemonCard() !== this) {
        return state;
      }

      // Power already alredy resolved
      if (pokemonSlot.marker.hasMarker(this.TRANSPARENCY_SUCCESS_MARKER, this)
        || pokemonSlot.marker.hasMarker(this.TRANSPARENCY_FAIL_MARKER, this)) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      // Ignore this attack
      effect.preventDefault = true;

      // Opponent flips coin, if heads prevent the damage
      return store.prompt(state, [new CoinFlipPrompt(opponent.id, GameMessage.COIN_FLIP)], result => {
        const markerName = result ? this.TRANSPARENCY_SUCCESS_MARKER : this.TRANSPARENCY_FAIL_MARKER;
        pokemonSlot.marker.addMarker(markerName, this);
        player.marker.addMarker(this.CLEAR_TRANSPARENCY_MARKER, this);
        store.reduceEffect(state, new UseAttackEffect(player, effect.attack));
      });
    }

    // Ignore all effect of attacks done to Haunter if transparency succeeded
    if (effect instanceof AbstractAttackEffect && effect.target.marker.hasMarker(this.TRANSPARENCY_SUCCESS_MARKER, this)) {
      // Block all effects, including damage
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }

    // Remove transparency markers at the end of the turn
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_TRANSPARENCY_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_TRANSPARENCY_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, pokemonSlot => {
        pokemonSlot.marker.removeMarker(this.TRANSPARENCY_SUCCESS_MARKER, this);
        pokemonSlot.marker.removeMarker(this.TRANSPARENCY_FAIL_MARKER, this);
      });
    }

    return state;
  }
}
