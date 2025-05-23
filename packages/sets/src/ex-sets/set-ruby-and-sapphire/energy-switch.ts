import {
  CardTransfer,
  Effect,
  EnergyCard,
  EnergyType,
  GameError,
  GameMessage,
  MoveEnergyPrompt,
  PlayerType,
  SlotType,
  State,
  StateUtils,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  // Player has no Basic Energy in the discard pile
  let hasBasicEnergy = false;
  let pokemonCount = 0;
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
    pokemonCount += 1;
    const basicEnergyAttached = cardList.cards.some(c => {
      return c instanceof EnergyCard && c.energyType === EnergyType.BASIC;
    });
    hasBasicEnergy = hasBasicEnergy || basicEnergyAttached;
  });

  if (!hasBasicEnergy || pokemonCount <= 1) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  let transfers: CardTransfer[] = [];
  yield store.prompt(
    state,
    new MoveEnergyPrompt(
      player.id,
      GameMessage.MOVE_ENERGY_CARDS,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      { min: 1, max: 1, allowCancel: true }
    ),
    result => {
      transfers = result || [];
      next();
    }
  );

  // Cancelled by the user
  if (transfers.length === 0) {
    return state;
  }

  // Discard trainer only when user selected a Pokemon
  player.hand.moveCardTo(effect.trainerCard, player.discard);

  transfers.forEach(transfer => {
    const source = StateUtils.getTarget(state, player, transfer.from);
    const target = StateUtils.getTarget(state, player, transfer.to);
    source.moveCardTo(transfer.card, target);
  });

  return state;
}

export class EnergySwitch extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'RS';

  public name: string = 'Energy Switch';

  public fullName: string = 'Energy Switch RS';

  public text: string = 'Move a basic Energy card attached to 1 of your Pokémon to another of your Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
