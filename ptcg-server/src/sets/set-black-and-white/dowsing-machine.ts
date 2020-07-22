import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType, CardTag } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { PlayTrainerEffect } from "../../game/store/effects/play-card-effects";
import { GameError, GameMessage } from "../../game/game-error";
import { Card} from "../../game/store/card/card";
import { ChooseCardsPrompt } from "../../game/store/prompts/choose-cards-prompt";
import { CardMessage } from "../card-message";
import { CardList } from "../../game/store/state/card-list";


function* playCard(next: Function, store: StoreLike, state: State,
  self: DowsingMachine, effect: PlayTrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const itemTypes = [TrainerType.ITEM, TrainerType.TOOL];
  let cards: Card[] = [];
  
  cards = player.hand.cards.filter(c => c !== self);
  if (cards.length < 2) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let trainersInDiscard = 0;
  player.discard.cards.forEach(c => {
    if (c instanceof TrainerCard && itemTypes.includes(c.trainerType)) {
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

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    CardMessage.CHOOSE_ANY_TWO_CARDS,
    handTemp,
    { },
    { min: 2, max: 2, allowCancel: true }
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

  player.discard.moveCardsTo(cards, player.hand);
  return state;
}

export class DowsingMachine extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public tags = [ CardTag.ACE_SPEC ];

  public set: string = 'BW';

  public name: string = 'Dowsing Machine';

  public fullName: string = 'Dowsing Machine PLS';

  public text: string =
    'Discard 2 cards from your hand. (If you can\'t discard 2 cards, ' +
    'you can\'t play this card.) Put a Trainer card from your discard ' +
    'pile into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayTrainerEffect && effect.trainerCard === this) {
      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }

}
