import {
  AttackAction,
  CardType,
  Simulator,
  SpecialCondition,
} from '@ptcg/common';

import { Porygon } from '../../../src/ex-sets/set-firered-and-leafgreen/porygon';
import { TestUtils } from '../../test-utils';

describe('Porygon RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Porygon()],
      [CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  // Data Retrieval () - If you have less than 4 cards in your hand, draw cards until you have 4 cards in your hand.
  it('Should use Data Retrieval with empty hand and draw 4 cards', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.hand.cards = [];
    player.deck.cards = TestUtils.makeTestCards(4);

    sim.dispatch(new AttackAction(1, 'Data Retrieval'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.hand.cards.length).toEqual(4);
    expect(player.deck.cards.length).toEqual(0);
  });

  it('Should use Data Retrieval with 1 card in hand and draw 3 cards', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    const existingCard = TestUtils.makeTestCards(1)[0];
    player.hand.cards = [existingCard];
    player.deck.cards = TestUtils.makeTestCards(3);

    sim.dispatch(new AttackAction(1, 'Data Retrieval'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.hand.cards.length).toEqual(4);
    expect(player.deck.cards.length).toEqual(0);
  });

  it('Should use Data Retrieval with 4 cards in hand and draw 0 cards', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    const existingCards = TestUtils.makeTestCards(4);
    player.hand.cards = existingCards;
    player.deck.cards = TestUtils.makeTestCards(1);

    sim.dispatch(new AttackAction(1, 'Data Retrieval'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.hand.cards.length).toEqual(4);
    expect(player.deck.cards.length).toEqual(1); // no cards drawn
  });

  // Confuse Ray (10) - The Defending Pokémon is now Confused.
  it('Should use Confuse Ray and confuse the defending Pokémon', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Confuse Ray'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.CONFUSED]);
  });
});
