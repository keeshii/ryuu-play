import {
  AttackAction,
  CardType,
  Simulator,
} from '@ptcg/common';

import { Mankey } from '../../../src/ex-sets/set-firered-and-leafgreen/mankey';
import { TestUtils } from '../../test-utils';

describe('Mankey RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Mankey()],
      [CardType.FIGHTING, CardType.COLORLESS],
    );
  });

  it('Should use Mischief attack and shuffle opponent deck', () => {
    const { opponent, prompts } = TestUtils.getAll(sim);
    opponent.deck.cards = TestUtils.makeTestCards(10);
    TestUtils.setCardIds(sim);
    const expectedDeck = opponent.deck.cards.slice().reverse();

    sim.dispatch(new AttackAction(1, 'Mischief'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Shuffle deck',
      playerId: opponent.id,
    }));

    // Opponent draws a card at the begining of the turn
    expectedDeck.shift();

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.deck.cards).toEqual(expectedDeck);
  });

  it('Should use Light Punch attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Light Punch'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
  });
});
