import { CardMessage } from "../card-message";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType, SuperType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { ChoosePokemonPrompt } from "../../game/store/prompts/choose-pokemon-prompt";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { PlayerType, SlotType, CoinFlipPrompt, StateUtils, CardTarget,
  GameError, GameMessage, PokemonCardList, ChooseCardsPrompt, Card } from "../../game";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  let hasPokemonWithEnergy = false;
  const blocked: CardTarget[] = [];
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    if (cardList.cards.some(c => c.superType === SuperType.ENERGY)) {
      hasPokemonWithEnergy = true;
    } else {
      blocked.push(target);
    }
  });

  if (!hasPokemonWithEnergy) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let coinResult: boolean = false;
  yield store.prompt(state, new CoinFlipPrompt(player.id, CardMessage.COIN_FLIP), result => {
    coinResult = result;
    next();
  });

  if (coinResult === false) {
    return state;
  }

  let targets: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    CardMessage.CHOOSE_ONE_POKEMON,
    PlayerType.TOP_PLAYER,
    [ SlotType.ACTIVE, SlotType.BENCH ],
    { allowCancel: false, blocked }
  ), results => {
    targets = results || [];
    next();
  });

  if (targets.length === 0) {
    return state;
  }

  const target = targets[0];
  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    CardMessage.CHOOSE_ENERGY_CARD,
    target,
    { superType: SuperType.ENERGY },
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    cards = selected;
    next();
  });

  target.moveCardsTo(cards, opponent.discard);
  return state;
}

export class CrushingHammer extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW';

  public name: string = 'Crushing Hammer';

  public fullName: string = 'Crushing Hammer EPO';

  public text: string =
    'Flip a coin. If heads, discard an Energy attached to 1 of your ' +
    'opponent\'s Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }

}
