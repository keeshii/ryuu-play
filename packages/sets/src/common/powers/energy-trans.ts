import {
  Card,
  CardTarget,
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  EnergyCard,
  GameMessage,
  MoveEnergyPrompt,
  PlayerType,
  PokemonCard,
  Power,
  PowerEffect,
  SlotType,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

import { CommonPower } from '../common.interfaces';


function* useEnergyTrans(
  next: Function,
  store: StoreLike,
  state: State,
  self: PokemonCard,
  effect: PowerEffect,
  cardType: CardType
): IterableIterator<State> {
  const player = effect.player;

  const blockedMap: { source: CardTarget; blocked: number[] }[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, card, target) => {
    const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, slot);
    store.reduceEffect(state, checkProvidedEnergy);
    const blockedCards: Card[] = [];

    checkProvidedEnergy.energyMap.forEach(em => {
      if (!em.provides.includes(cardType) && !em.provides.includes(CardType.ANY)) {
        blockedCards.push(em.card);
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

  return store.prompt(
    state,
    new MoveEnergyPrompt(
      effect.player.id,
      GameMessage.MOVE_ENERGY_CARDS,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { },
      { allowCancel: true, blockedMap }
    ),
    transfers => {
      if (transfers === null) {
        return;
      }

      for (const transfer of transfers) {
        const source = StateUtils.getTarget(state, player, transfer.from);
        const target = StateUtils.getTarget(state, player, transfer.to);
        source.moveCardTo(transfer.card, target.energies);
      }
    }
  );
}

export const energyTrans: CommonPower<[cardType: CardType]> = function(
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {
  return {
    reduce: (power: Power, cardType: CardType) => {
      if (effect instanceof PowerEffect && effect.power === power) {
        const generator = useEnergyTrans(() => generator.next(), store, state, self, effect, cardType);
        return generator.next().value;
      }
      return state;
    }
  };
};
