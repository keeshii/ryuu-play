import {
  Card,
  CardTarget,
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  EnergyCard,
  GameError,
  GameMessage,
  MoveEnergyPrompt,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  SlotType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';
import { commonMarkers } from '../../common';

export class Charmander extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 40;

  public powers = [
    {
      name: 'Gather Fire',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'Once during your turn (before your attack), you may take 1 R Energy card attached to 1 of your other ' +
        'Pokémon and attach it to Charmander. This power can\'t be used if Charmander is Asleep, Confused, or ' +
        'Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Fire Tail',
      cost: [CardType.FIRE],
      damage: '20',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Charmander';

  public fullName: string = 'Charmander TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const powerUseOnce = commonMarkers.powerUseOnce(this, store, state, effect);

    
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (pokemonSlot === undefined
        || pokemonSlot.specialConditions.includes(SpecialCondition.ASLEEP)
        || pokemonSlot.specialConditions.includes(SpecialCondition.CONFUSED)
        || pokemonSlot.specialConditions.includes(SpecialCondition.PARALYZED)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (powerUseOnce.hasMarker(effect)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      let hasFireEnergy = false;
      const blockedFrom: CardTarget[] = [];
      const blockedTo: CardTarget[] = [];
      const blockedMap: { source: CardTarget; blocked: number[] }[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, card, target) => {
        if (slot === pokemonSlot) {
          blockedFrom.push(target);
          return;
        }
        blockedTo.push(target);
        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, slot);
        store.reduceEffect(state, checkProvidedEnergy);
        const blockedCards: Card[] = [];

        checkProvidedEnergy.energyMap.forEach(em => {
          if (!em.provides.includes(CardType.FIRE)) {
            blockedCards.push(em.card);
          } else {
            hasFireEnergy = true;
          }
        });

        const blocked: number[] = [];
        blockedCards.forEach(bc => {
          const index = slot.energies.cards.indexOf(bc as EnergyCard);
          if (index !== -1 && !blocked.includes(index)) {
            blocked.push(index);
          }
        });

        if (blocked.length !== 0) {
          blockedMap.push({ source: target, blocked });
        }
      });

      if (!hasFireEnergy) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(
        state,
        new MoveEnergyPrompt(
          effect.player.id,
          GameMessage.MOVE_ENERGY_CARDS,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { },
          { min: 1, max: 1, allowCancel: true, blockedTo, blockedFrom, blockedMap }
        ),
        transfers => {
          if (transfers === null) {
            return;
          }

          powerUseOnce.setMarker(effect);
          for (const transfer of transfers) {
            const source = StateUtils.getTarget(state, player, transfer.from);
            const target = StateUtils.getTarget(state, player, transfer.to);
            source.moveCardTo(transfer.card, target.energies);
          }
        }
      );
    }

    return state;
  }
}
