import {
  AddSpecialConditionsEffect,
  AttachEnergyEffect,
  AttachEnergyPrompt,
  AttackEffect,
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
  PokemonCardList,
  PowerEffect,
  PowerType,
  SlotType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

export class Swampert extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Marshtomp';

  public cardType: CardType = CardType.WATER;

  public hp: number = 110;

  public powers = [
    {
      name: 'Water Call',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may attach a W Energy card from your hand to your ' +
        'Active Pokémon. This power can\'t be used if Swampert is affected by a Special Condition.',
    },
  ];

  public attacks = [
    {
      name: 'Hypno Splash',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: 'The Defending Pokémon is now Asleep.',
    },
  ];

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Swampert';

  public fullName: string = 'Swampert RS';

  public readonly WATER_CALL_MARKER = 'WATER_CALL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.WATER_CALL_MARKER, this);
      return state;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      if (cardList.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard && c.provides.includes(CardType.WATER);
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.WATER_CALL_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      return store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          player.discard,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE],
          {
            superType: SuperType.ENERGY,
            energyType: EnergyType.BASIC,
            name: 'Water Energy',
          },
          { allowCancel: true, min: 1, max: 1 }
        ),
        transfers => {
          transfers = transfers || [];
          // cancelled by user
          if (transfers.length === 0) {
            return;
          }
          player.marker.addMarker(this.WATER_CALL_MARKER, this);
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            const energyCard = transfer.card as EnergyCard;
            const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
            store.reduceEffect(state, attachEnergyEffect);
          }
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.WATER_CALL_MARKER, this);
    }

    return state;
  }
}
