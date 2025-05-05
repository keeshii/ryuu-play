import { Card } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType, SuperType, Stage } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { TrainerEffect } from '@ptcg/common';
import { ChooseCardsPrompt } from '@ptcg/common';
import { ShuffleDeckPrompt } from '@ptcg/common';
import { PokemonCardList } from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
  const max = Math.min(slots.length, 3);

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.POKEMON, stage: Stage.BASIC } as any,
    { min: 0, max, allowCancel: true, differentTypes: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  cards.forEach((card, index) => {
    player.deck.moveCardTo(card, slots[index]);
    slots[index].pokemonPlayedTurn = state.turn;
  });

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class ProfessorOaksSetup extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BW3';

  public name: string = 'Professor Oak\'s Setup';

  public fullName: string = 'Professor Oak\'s Setup CEC';

  public text: string =
    'Search your deck for up to 3 Basic Pokemon of different types and ' +
    'put them onto your Bench. Then, shuffle your deck.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
