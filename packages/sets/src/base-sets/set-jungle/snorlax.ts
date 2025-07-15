import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CheckTableStateEffect,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Snorlax extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 90;

  public powers = [
    {
      name: 'Thick Skinned',
      powerType: PowerType.POKEPOWER,
      text:
        'Snorlax can\'t become Asleep, Confused, Paralyzed, or Poisoned. This power can\'t be used if Snorlax is ' +
        'already Asleep, Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Body Slam',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Snorlax';

  public fullName: string = 'Snorlax JU';

  public readonly THICK_SKIN_BLOCKED_MARKER = 'THICK_SKIN_BLOCKED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckTableStateEffect) {
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);
      if (!pokemonSlot || pokemonSlot.getPokemonCard() !== this) {
        return state;
      }

      const player = StateUtils.findOwner(state, pokemonSlot);
      const hasMarker = player.marker.hasMarker(this.THICK_SKIN_BLOCKED_MARKER, this);
      const affectedBySpecialCondition = pokemonSlot.specialConditions.includes(SpecialCondition.ASLEEP)
        || pokemonSlot.specialConditions.includes(SpecialCondition.CONFUSED)
        || pokemonSlot.specialConditions.includes(SpecialCondition.PARALYZED);

      // The Power was blocked and now Snorlax is affected by Special Condition.
      // Thick Skin is not working.
      if (hasMarker && affectedBySpecialCondition) {
        return state;
      }

      // The Power was never blocked and no Special Condition on Snorlax.
      // No need to use PowerEffect
      if (!hasMarker && (player.active !== pokemonSlot || pokemonSlot.specialConditions.length === 0)) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        // If Snorlax will be affected by Special Condition while having this Marker,
        // he won't heal by itself even if Power will no longer be blocked.
        player.marker.addMarker(this.THICK_SKIN_BLOCKED_MARKER, this);
        return state;
      }

      player.marker.removeMarker(this.THICK_SKIN_BLOCKED_MARKER, this);
      const conditions = player.active.specialConditions.slice();
      conditions.forEach(condition => {
        player.active.removeSpecialCondition(condition);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    return state;
  }
}
