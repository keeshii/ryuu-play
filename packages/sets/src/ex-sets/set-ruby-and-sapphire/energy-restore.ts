import {
  ChooseCardsPrompt,
  CoinFlipPrompt,
  Effect,
  EnergyCard,
  EnergyType,
  GameError,
  GameMessage,
  State,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  // Player has no Basic Energy in the discard pile
  let basicEnergyCards = 0;
  player.discard.cards.forEach(c => {
    if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC) {
      basicEnergyCards++;
    }
  });
  if (basicEnergyCards === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let heads: number = 0;
  yield store.prompt(
    state,
    [
      new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
      new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
      new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
    ],
    results => {
      results.forEach(r => {
        heads += r ? 1 : 0;
      });
      next();
    }
  );

  if (heads === 0) {
    return state;
  }

  const min = Math.min(basicEnergyCards, heads);
  return store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.discard,
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      { min, max: min, allowCancel: false }
    ),
    cards => {
      cards = cards || [];
      if (cards.length > 0) {
        // Discard trainer only when user selected a Pokemon
        player.hand.moveCardTo(effect.trainerCard, player.discard);
        // Recover discarded Pokemon
        player.discard.moveCardsTo(cards, player.hand);
      }
    }
  );
}

export class EnergyRestore extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'RS';

  public name: string = 'Energy Restore';

  public fullName: string = 'Energy Restore RS';

  public text: string =
    'Flip 3 coins. For each heads, put a Basic Energy card from your discard pile into your hand. If you don\'t have ' +
    'that many basic Energy cards in your discard pile, put all of them into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
