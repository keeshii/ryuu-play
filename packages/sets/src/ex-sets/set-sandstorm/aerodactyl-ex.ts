import {
  AddSpecialConditionsEffect,
  AttachPokemonToolEffect,
  AttackEffect,
  CardTag,
  CardType,
  CheckTableStateEffect,
  Effect,
  GameError,
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
} from '@ptcg/common';

export class AerodactylEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Mysterious Fossil';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 100;

  public powers = [
    {
      name: 'Primal Lock',
      powerType: PowerType.POKEBODY,
      text:
        'As long as Aerodactyl ex is in play, your opponent can\'t play Pokémon Tool cards. Remove any Pokémon Tool ' +
        'cards attached to your opponent\'s Pokémon and put them into his or her discard pile.'
    },
  ];

  public attacks = [
    {
      name: 'Supersonic',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: 'The Defending Pokémon is now Confused.'
    },
    {
      name: 'Wing Attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '60',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Aerodactyl ex';

  public fullName: string = 'Aerodactyl ex SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Block playing Pokemon Tools from hand
    if (effect instanceof AttachPokemonToolEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isAerodactylInPlay = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (pokemonSlot, pokemonCard) => {
        if (pokemonCard === this) {
          isAerodactylInPlay = true;
        }
      });

      if (!isAerodactylInPlay) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }

    // Discards Pokemon Tools in play
    if (effect instanceof CheckTableStateEffect) {
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);
      if (!pokemonSlot || pokemonSlot.getPokemonCard() !== this) {
        return state;
      }

      const player = StateUtils.findOwner(state, pokemonSlot);
      const opponent = StateUtils.getOpponent(state, player);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, pokemonSlot => {
        const toolCards = pokemonSlot.getTools();
        pokemonSlot.trainers.moveCardsTo(toolCards, opponent.discard);
      });
      
      return state;
    }

    // Attack effects
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}
