import {
  AttachEnergyPrompt,
  AttackEffect,
  Card,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseEnergyPrompt,
  DiscardCardsEffect,
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
  PutDamageEffect,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

export class Blaziken extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Combusken';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 100;

  public powers = [
    {
      name: 'Firestarter',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'Once during your turn (before your attack), you may attach a R Energy card from your discard pile to 1 ' +
        'of your Benched Pokémon. This power can\'t be used if Blaziken is affected by a Special Condition.',
    },
  ];

  public attacks = [
    {
      name: 'Fire Stream',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text:
        'Discard a R Energy card attached to Blaziken. If you do, this attack does 10 damage to each of your ' +
        'opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)',
    },
  ];

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Blaziken';

  public fullName: string = 'Blaziken RS';

  public readonly FIRESTARTER_MARKER = 'FIRESTARTER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.FIRESTARTER_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (!pokemonSlot || pokemonSlot.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const hasBench = player.bench.some(b => b.pokemons.cards.length > 0);
      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.provides.includes(CardType.FIRE);
      });
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.FIRESTARTER_MARKER, this)) {
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
            name: 'Fire Energy',
          },
          { allowCancel: true, min: 1, max: 1 }
        ),
        transfers => {
          transfers = transfers || [];
          // cancelled by user
          if (transfers.length === 0) {
            return;
          }
          player.marker.addMarker(this.FIRESTARTER_MARKER, this);
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            player.discard.moveCardTo(transfer.card, target.energies);
          }
        }
      );

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      return store.prompt(
        state,
        new ChooseEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          checkProvidedEnergy.energyMap,
          [CardType.FIRE],
          { allowCancel: true }
        ),
        energy => {
          const cards: Card[] = (energy || []).map(e => e.card);
          if (cards.length > 0) {
            const discardEnergy = new DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);

            opponent.bench.forEach(benched => {
              if (benched.pokemons.cards.length > 0) {
                const dealDamage = new PutDamageEffect(effect, 10);
                dealDamage.target = benched;
                state = store.reduceEffect(state, dealDamage);
              }
            });
          }
        }
      );
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.FIRESTARTER_MARKER, this);
    }

    return state;
  }
}
