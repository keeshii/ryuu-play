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

export class Lunatone extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 60;

  public powers = [
    {
      name: 'Lunar Eclipse',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), if Solrock is in play, you may use this power. Until the end ' +
        'of your turn, Lunatone\'s type is D. This power can\'t be used if Lunatone is affected by a Special ' +
        'Condition.'
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
      name: 'Lunar Blast',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '30',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Lunatone';

  public fullName: string = 'Lunatone SS';

  public readonly LUNAR_ECLIPSE_MARKER = 'TYPE_SHIFT_MARKER';

  public readonly CLEAR_LUNAR_ECLIPSE_MARKER = 'CLEAR_TYPE_SHIFT_MARKER';

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

      let hasSlorock = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, pokemonCard) => {
        if (pokemonCard.name === 'Solrock') {
          hasSlorock = true;
        }
      });

      if (!hasSlorock) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (pokemonSlot.marker.hasMarker(this.LUNAR_ECLIPSE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      player.marker.addMarker(this.CLEAR_LUNAR_ECLIPSE_MARKER, this);
      pokemonSlot.marker.addMarker(this.LUNAR_ECLIPSE_MARKER, this);
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

    if (effect instanceof CheckPokemonTypeEffect && effect.target.marker.hasMarker(this.LUNAR_ECLIPSE_MARKER, this)) {
      effect.cardTypes = [CardType.DARK];
      return state;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_LUNAR_ECLIPSE_MARKER, this)) {
      const player = effect.player;
      player.marker.removeMarker(this.CLEAR_LUNAR_ECLIPSE_MARKER, this);
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        cardList.marker.removeMarker(this.LUNAR_ECLIPSE_MARKER, this);
      });
    }

    return state;
  }
}
