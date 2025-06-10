import {
  AddMarkerEffect,
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  GamePhase,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  RetreatEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Silcoon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Wurmple';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 60;

  public powers = [
    {
      name: 'Hard Cocoon',
      powerType: PowerType.POKEBODY,
      text:
        'During your opponent\'s turn, if Silcoon would be damaged by an opponent\'s attack (after applying Weakness ' +
        'and Resistance), flip a coin. If heads, reduce that damage by 30.',
    },
  ];

  public attacks = [
    {
      name: 'Gooey Thread',
      cost: [CardType.GRASS],
      damage: '10',
      text: 'The Defending Pokémon can\'t retreat until the end of your opponent\'s next turn.',
    },
  ];

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Silcoon';

  public fullName: string = 'Silcoon RS';

  public readonly HARD_COCOON_MARKER = 'HARD_COCOON_MARKER';

  public readonly CLEAR_HARD_COCOON_MARKER = 'HARD_COCOON_MARKER';

  public readonly GOOEY_THREAD_MARKER = 'GOOEY_THREAD_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.opponent.active.pokemons.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = opponent.active.getPokemonCard();

      // pokemon is evolved
      if (pokemonCard !== this) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(opponent, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      return store.prompt(state, new CoinFlipPrompt(opponent.id, GameMessage.COIN_FLIP), flipResult => {
        if (flipResult) {
          opponent.active.marker.addMarker(this.HARD_COCOON_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_HARD_COCOON_MARKER, this);
        }
      });
    }

    // Reduce damage by 30
    if (effect instanceof PutDamageEffect && effect.target.marker.hasMarker(this.HARD_COCOON_MARKER, this)) {
      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      effect.target.marker.removeMarker(this.HARD_COCOON_MARKER, this);
      effect.damage -= 30;
      return state;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_HARD_COCOON_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_HARD_COCOON_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, pokemonSlot => {
        pokemonSlot.marker.removeMarker(this.HARD_COCOON_MARKER, this);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const addMarkerEffect = new AddMarkerEffect(effect, this.GOOEY_THREAD_MARKER, this);
      return store.reduceEffect(state, addMarkerEffect);
    }

    // Block retreat for opponent's Pokemon with marker.
    if (effect instanceof RetreatEffect) {
      const player = effect.player;

      const hasMarker = player.active.marker.hasMarker(this.GOOEY_THREAD_MARKER);
      if (!hasMarker) {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.GOOEY_THREAD_MARKER, this);
    }

    return state;
  }
}
