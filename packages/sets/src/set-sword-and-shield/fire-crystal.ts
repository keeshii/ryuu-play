import {
  CardType,
  ChooseCardsPrompt,
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

  // Player has no Fire Energy in the discard pile
  let energyInDiscard = 0;
  player.discard.cards.forEach(c => {
    if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.provides.includes(CardType.FIRE)) {
      energyInDiscard += 1;
    }
  });
  if (energyInDiscard === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const max = Math.min(3, energyInDiscard);

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  return store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.discard,
      {
        superType: SuperType.ENERGY,
        energyType: EnergyType.BASIC,
        name: 'Fire Energy',
      },
      { min: max, max, allowCancel: true }
    ),
    selected => {
      if (selected && selected.length > 0) {
        // Discard trainer only when user selected some cards
        player.hand.moveCardTo(effect.trainerCard, player.discard);
        // Recover discarded energies
        player.discard.moveCardsTo(selected, player.hand);
      }
    }
  );
}

export class FireCrystal extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'SSH';

  public name: string = 'Fire Crystal';

  public fullName: string = 'Fire Crystal UNB';

  public text: string = 'Put 3 R Energy cards from your discard pile into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
