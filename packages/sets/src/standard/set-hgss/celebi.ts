import {
  AttachEnergyPrompt,
  AttackEffect,
  CardType,
  Effect,
  EndTurnEffect,
  EnergyCard,
  GameError,
  GameMessage,
  PlayerType,
  PlayPokemonEffect,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Celebi extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public powers = [
    {
      name: 'Forest Breath',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'Once during your turn (before your attack), if Celebi is your ' +
        'Active Pokémon, you may attach a G Energy card from your hand ' +
        'to 1 of your Pokémon. This power can\'t be used if Celebi is ' +
        'affected by a Special Condition.',
    },
  ];

  public attacks = [
    {
      name: 'Time Circle',
      cost: [CardType.GRASS, CardType.PSYCHIC, CardType.COLORLESS],
      damage: '30',
      text:
        'During your opponent\'s next turn, prevent all damage done to ' +
        'Celebi by attacks from your opponent\'s Stage 1 or Stage 2 Pokémon.',
    },
  ];

  public set: string = 'HGSS';

  public name: string = 'Celebi';

  public fullName: string = 'Celebi TRM';

  public readonly FOREST_BREATH_MARKER: string = 'FOREST_BREATH_MARKER';

  public readonly TIME_CIRCLE_MARKER: string = 'TIME_CIRCLE_MARKER';

  public readonly CLEAR_TIME_CIRCLE_MARKER: string = 'CLEAR_TIME_CIRCLE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.FOREST_BREATH_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (pokemonSlot !== player.active) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (pokemonSlot.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard && c.name === 'Grass Energy';
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.FOREST_BREATH_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      return store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          player.hand,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { name: 'Grass Energy' },
          { allowCancel: true, min: 1, max: 1 }
        ),
        transfers => {
          transfers = transfers || [];
          // cancelled by user
          if (transfers.length === 0) {
            return;
          }
          player.marker.addMarker(this.FOREST_BREATH_MARKER, this);
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            player.hand.moveCardTo(transfer.card, target.energies);
          }
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.TIME_CIRCLE_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_TIME_CIRCLE_MARKER, this);
      return state;
    }

    if (effect instanceof PutDamageEffect && effect.target.marker.hasMarker(this.TIME_CIRCLE_MARKER)) {
      const card = effect.source.getPokemonCard();
      const stage = card !== undefined ? card.stage : undefined;

      if (stage === Stage.STAGE_1 || stage === Stage.STAGE_2) {
        effect.preventDefault = true;
      }

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.FOREST_BREATH_MARKER, this);

      if (effect.player.marker.hasMarker(this.CLEAR_TIME_CIRCLE_MARKER, this)) {
        effect.player.marker.removeMarker(this.CLEAR_TIME_CIRCLE_MARKER, this);
        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, pokemonSlot => {
          pokemonSlot.marker.removeMarker(this.TIME_CIRCLE_MARKER, this);
        });
      }
    }

    return state;
  }
}
