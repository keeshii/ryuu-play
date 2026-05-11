import {
  CardTarget,
  ConfirmPrompt,
  Effect,
  EnergyType,
  GameMessage,
  MoveEnergyPrompt,
  PlayerType,
  PlayPokemonEffect,
  PokemonCard,
  Power,
  PowerEffect,
  SlotType,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

import { CommonPower } from '../common.interfaces';


function* useLegendaryAscent(
  next: Function,
  store: StoreLike,
  state: State,
  effect: PlayPokemonEffect,
  self: PokemonCard,
  energyName: string
): IterableIterator<State> {
  const player = effect.player;

  let wantToUse = false;
  yield store.prompt(state, new ConfirmPrompt(effect.player.id, GameMessage.WANT_TO_USE_ABILITY), result => {
    wantToUse = result;
    next();
  });

  if (!wantToUse) {
    return state;
  }

  // Switch Articuno to Active
  player.switchPokemon(effect.target);

  let hasWaterEnergy = false;
  const blockedTo: CardTarget[] = [];
  const blockedFrom: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    if (card === self) {
      blockedFrom.push(target);
    } else {
      blockedTo.push(target);
      if (cardList.energies.cards.some(c => c.name === energyName)) {
        hasWaterEnergy = true;
      }
    }
  });

  if (!hasWaterEnergy) {
    return state;
  }

  return store.prompt(
    state,
    new MoveEnergyPrompt(
      effect.player.id,
      GameMessage.MOVE_ENERGY_TO_ACTIVE,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      {
        superType: SuperType.ENERGY,
        energyType: EnergyType.BASIC,
        name: 'Water Energy',
      },
      { allowCancel: true, blockedFrom, blockedTo }
    ),
    result => {
      const transfers = result || [];
      transfers.forEach(transfer => {
        const source = StateUtils.getTarget(state, player, transfer.from);
        const target = StateUtils.getTarget(state, player, transfer.to);
        source.moveCardTo(transfer.card, target.energies);
      });
    }
  );
}

export const legendaryAscent: CommonPower<[energyName: string]> = function(
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {
  return {
    reduce: (power: Power, energyName: string) => {
      if (effect instanceof PlayPokemonEffect && effect.pokemonCard === self) {
        const player = effect.player;

        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const powerEffect = new PowerEffect(player, power, self);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }

        const generator = useLegendaryAscent(() => generator.next(), store, state, effect, self, energyName);
        return generator.next().value;
      }
      return state;
    }
  };
};
