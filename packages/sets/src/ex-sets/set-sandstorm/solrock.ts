import {
  AttackEffect,
  CardType,
  CheckPokemonTypeEffect,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Solrock extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 70;

  public powers = [
    {
      name: 'Solar Eclipse',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'Once during your turn (before your attack), if Lunatone is in play, you may use this power. Until the end ' +
        'of your turn, Solrock\'s type is R. This power can\'t be used if Solrock is affected by a Special Condition.'
    },
  ];

  public attacks = [
    {
      name: 'Cosmic Draw',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'If your opponent has any Evolved Pokémon in play, draw 3 cards.'
    },
    {
      name: 'Solar Blast',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Solrock';

  public fullName: string = 'Solrock SS';

  public readonly SOLAR_ECLIPSE_MARKER = 'TYPE_SHIFT_MARKER';

  public readonly CLEAR_SOLAR_ECLIPSE_MARKER = 'CLEAR_TYPE_SHIFT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (!pokemonSlot || pokemonSlot.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (pokemonSlot.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      let hasLunatone = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, pokemonCard) => {
        if (pokemonCard.name === 'Lunatone') {
          hasLunatone = true;
        }
      });

      if (!hasLunatone) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (pokemonSlot.marker.hasMarker(this.SOLAR_ECLIPSE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      player.marker.addMarker(this.CLEAR_SOLAR_ECLIPSE_MARKER, this);
      pokemonSlot.marker.addMarker(this.SOLAR_ECLIPSE_MARKER, this);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let hasEvolved = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, pokemonSlot => {
        if (pokemonSlot.pokemons.cards.length > 1) {
          hasEvolved = true;
        }
      });

      if (!hasEvolved) {
        return state;
      }

      player.deck.moveTo(player.hand, 3);
      return state;
    }

    if (effect instanceof CheckPokemonTypeEffect && effect.target.marker.hasMarker(this.SOLAR_ECLIPSE_MARKER, this)) {
      effect.cardTypes = [CardType.FIRE];
      return state;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_SOLAR_ECLIPSE_MARKER, this)) {
      const player = effect.player;
      player.marker.removeMarker(this.CLEAR_SOLAR_ECLIPSE_MARKER, this);
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        cardList.marker.removeMarker(this.SOLAR_ECLIPSE_MARKER, this);
      });
    }

    return state;
  }
}
