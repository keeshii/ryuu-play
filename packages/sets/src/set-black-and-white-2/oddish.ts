import { Card } from '@ptcg/common';
import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, SuperType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { AttackEffect } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { ChooseCardsPrompt } from '@ptcg/common';
import { ShowCardsPrompt } from '@ptcg/common';
import { ShuffleDeckPrompt } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';


function* useFindAFriend(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.POKEMON, cardType: CardType.GRASS },
    { min: 1, max: 1, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.deck.moveCardsTo(cards, player.hand);

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Oddish extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 40;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Ram',
    cost: [ CardType.COLORLESS ],
    damage: 10,
    text: ''
  }, {
    name: 'Find a Friend',
    cost: [ CardType.GRASS ],
    damage: 0,
    text: 'Flip a coin. If heads, search your deck for a G Pokemon, ' +
      'show it to your opponent, and put it into your hand. ' +
      'Shuffle your deck afterward.'
  }];

  public set: string = 'BW2';

  public name: string = 'Oddish';

  public fullName: string = 'Oddish UND';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = useFindAFriend(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }

}
