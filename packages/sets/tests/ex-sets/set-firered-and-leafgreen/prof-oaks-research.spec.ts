import {
  PlayCardAction,
  Simulator,
} from '@ptcg/common';

import { ProfOaksResearch } from '../../../src/ex-sets/set-firered-and-leafgreen/prof-oaks-research';
import { TestCard } from '../../test-cards/test-card';
import { TestUtils } from '../../test-utils';

describe("Prof. Oak's Research RG", () => {
  let sim: Simulator;
  let trainerCard: ProfOaksResearch;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    trainerCard = new ProfOaksResearch();

    const state = sim.store.state;
    state.players[0].hand.cards = [trainerCard];
  });

  it('Should play Prof. Oak\'s Research and shuffle hand into deck then draw 5', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    // Add additional cards to hand so shuffle prompt is expected
    const c1 = new TestCard();
    const c2 = new TestCard();
    player.hand.cards.push(c1, c2);

    // Ensure deck has enough cards to draw
    player.deck.cards = TestUtils.makeTestCards(5);

    sim.dispatch(new PlayCardAction(1, index, target));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Shuffle deck',
      playerId: player.id
    }));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.hand.cards.length).toEqual(5);
    expect(player.supporter.cards).toEqual([trainerCard]);
  });

  it('Should play Prof. Oak\'s Research with only the supporter in hand and draw 5 without shuffle', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    // No other cards in hand
    player.deck.cards = TestUtils.makeTestCards(5);

    sim.dispatch(new PlayCardAction(1, index, target));

    expect(prompts.length).toEqual(0);
    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.hand.cards.length).toEqual(5);
    expect(player.supporter.cards).toEqual([trainerCard]);
  });
});
