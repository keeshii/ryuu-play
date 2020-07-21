import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { PlayTrainerEffect } from "../../game/store/effects/play-card-effects";
import { GameError, GameMessage } from "../../game/game-error";
import { Card} from "../../game/store/card/card";
import { ChooseCardsPrompt } from "../../game/store/prompts/choose-cards-prompt";
import { CardMessage } from "../card-message";
import {CardList} from "../../game/store/state/card-list";

function* playCard(next: Function, store: StoreLike, state: State, self: JunkArm, effect: PlayTrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const itemTypes = [TrainerType.ITEM, TrainerType.TOOL];

  if (player.hand.cards.length <= 2) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let trainersInDiscard = 0;
  player.discard.cards.forEach(c => {
    if (c instanceof TrainerCard && itemTypes.includes(c.trainerType) && c.name !== self.name) {
      trainersInDiscard += 1;
    }
  });
  if (trainersInDiscard === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  // prepare card list without Junk Arm
  const handTemp = new CardList();
  handTemp.cards = player.hand.cards.filter(c => c !== self);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    CardMessage.CHOOSE_ANY_TWO_CARDS,
    handTemp,
    { },
    { min: 0, max: 2, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  // Operation canceled by the user
  if (cards.length === 0) {
    return state;
  }

  player.hand.moveCardTo(self, player.discard);
  player.hand.moveCardsTo(cards, player.discard);

  const blocked: number[] = [];
  player.discard.cards.forEach((c, index) => {
    if (!(c instanceof TrainerCard) || cards.includes(c)) {
      blocked.push(index);
      return;
    }
    if (!itemTypes.includes(c.trainerType) || c.name === self.name) {
      blocked.push(index);
      return;
    }
  });

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    CardMessage.CHOOSE_TRAINER_CARD,
    player.discard,
    { },
    { min: 1, max: 1, allowCancel: false, blocked }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.discard.moveCardsTo(cards, player.hand)

  return state;
}

export class JunkArm extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'HGSS';

  public name: string = 'Junk Arm';

  public fullName: string = 'Junk Arm TRM';

  public text: string =
    'Discard 2 cards from your hand. Search your discard pile for a Trainer ' +
    'card, show it to your opponent, and put it into your hand. You can\'t ' +
    'choose Junk Arm with the effect of this card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayTrainerEffect && effect.trainerCard === this) {
      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }

}
