import { Effect } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { State } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType, SuperType, Stage } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { UseStadiumEffect } from '@ptcg/common';
import { ChooseCardsPrompt } from '@ptcg/common';
import { Card } from '@ptcg/common';
import { PokemonCardList } from '@ptcg/common';
import { PokemonCard } from '@ptcg/common';
import { CoinFlipPrompt } from '@ptcg/common';

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
