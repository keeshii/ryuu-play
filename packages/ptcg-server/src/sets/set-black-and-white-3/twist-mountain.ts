import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType, Stage } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { Card } from '../../game/store/card/card';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';

function* useStadium(next: Function, store: StoreLike, state: State, effect: UseStadiumEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
  const hasRestored = player.hand.cards.some(c => {
    return c instanceof PokemonCard && c.stage === Stage.RESTORED;
  });

  if (slots.length === 0 || !hasRestored) {
    throw new GameError(GameMessage.CANNOT_USE_STADIUM);
  }

  let flipResult = false;
  yield store.prompt(state, new CoinFlipPrompt(
    player.id, GameMessage.COIN_FLIP
  ), result => {
    flipResult = result;
    next();
  });

  if (!flipResult) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
    player.hand,
    { superType: SuperType.POKEMON, stage: Stage.RESTORED },
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > slots.length) {
    cards.length = slots.length;
  }

  cards.forEach((card, index) => {
    player.hand.moveCardTo(card, slots[index]);
    slots[index].pokemonPlayedTurn = state.turn;
  });

  return state;
}

export class TwistMountain extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW3';

  public name: string = 'Twist Mountain';

  public fullName: string = 'Twist Mountain DEX';

  public text: string =
    'Once during each player\'s turn, that player may flip a coin. ' +
    'If heads, the player puts a Restored Pokemon from his or her hand ' +
    'onto his or her Bench.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      const generator = useStadium(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
