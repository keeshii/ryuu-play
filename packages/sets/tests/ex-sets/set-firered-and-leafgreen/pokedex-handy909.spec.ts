import {
    CardList,
  GameMessage,
  PlayCardAction,
  ResolvePromptAction,
  Simulator,
  TrainerCard,
} from '@ptcg/common';

import { PokedexHandy909 } from '../../../src/ex-sets/set-firered-and-leafgreen/pokedex-handy909';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('PokeDex HANDY909 RG', () => {
  let sim: Simulator;
  let trainerCard: TrainerCard;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    trainerCard = new PokedexHandy909();

    const state = sim.store.state;
    state.players[0].hand.cards = [trainerCard];
  });

  it('Should play PokeDex HANDY909 and reorder the top 6 cards of the deck', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    const cards = [
      new TestPokemon(),
      new TestPokemon(),
      new TestPokemon(),
      new TestPokemon(),
      new TestPokemon(),
      new TestPokemon(),
      new TestPokemon(),
    ];

    player.deck.cards = cards.slice();

    const cardList = new CardList();
    cardList.cards = player.deck.cards.slice(0, 6);

    sim.dispatch(new PlayCardAction(1, index, target));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Order cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARDS_ORDER,
      cards: cardList,
      options: jasmine.objectContaining({ allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, [1, 0, 2, 3, 4, 5]));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.deck.cards.slice(0, 6)).toEqual([
      cards[1],
      cards[0],
      cards[2],
      cards[3],
      cards[4],
      cards[5],
    ]);
  });

  it('Should play PokeDex HANDY909 and keep the top cards order when canceled', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    const cards = [
      new TestPokemon(),
      new TestPokemon(),
      new TestPokemon(),
      new TestPokemon(),
      new TestPokemon(),
      new TestPokemon(),
    ];

    player.deck.cards = cards.slice();

    sim.dispatch(new PlayCardAction(1, index, target));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Order cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARDS_ORDER,
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.deck.cards.slice(0, 6)).toEqual(cards);
  });

  it('Should not play PokeDex HANDY909 when the deck is empty', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);
    player.deck.cards = [];

    let message = '';
    try {
      sim.dispatch(new PlayCardAction(1, index, target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_PLAY_THIS_CARD);
  });
});
