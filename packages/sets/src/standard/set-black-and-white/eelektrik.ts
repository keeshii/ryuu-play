import {
  AttachEnergyPrompt,
  CardType,
  Effect,
  EndTurnEffect,
  EnergyCard,
  EnergyType,
  GameError,
  GameMessage,
  PlayerType,
  PlayPokemonEffect,
  PokemonCard,
  PowerEffect,
  PowerType,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

export class Eelektrik extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Tynamo';

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 90;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Dynamotor',
      powerType: PowerType.ABILITY,
      useWhenInPlay: true,
      text:
        'Once during your turn (before your attack), you may attach a L ' +
        'Energy card from your discard pile to 1 of your Benched Pokémon.',
    },
  ];

  public attacks = [
    {
      name: 'Electric Ball',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: '50',
      text: '',
    },
  ];

  public set: string = 'BW';

  public name: string = 'Eelektrik';

  public fullName: string = 'Eelektrik NV';

  public readonly DYNAMOTOR_MAREKER = 'DYNAMOTOR_MAREKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.DYNAMOTOR_MAREKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      const hasBench = player.bench.some(b => b.pokemons.cards.length > 0);
      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.provides.includes(CardType.LIGHTNING);
      });
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.DYNAMOTOR_MAREKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      state = store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          player.discard,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          {
            superType: SuperType.ENERGY,
            energyType: EnergyType.BASIC,
            name: 'Lightning Energy',
          },
          { allowCancel: true, min: 1, max: 1 }
        ),
        transfers => {
          transfers = transfers || [];
          // cancelled by user
          if (transfers.length === 0) {
            return;
          }
          player.marker.addMarker(this.DYNAMOTOR_MAREKER, this);
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            player.discard.moveCardTo(transfer.card, target.energies);
          }
        }
      );

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.DYNAMOTOR_MAREKER, this);
    }

    return state;
  }
}
