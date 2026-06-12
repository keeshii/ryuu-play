import {
  AttackAction,
  CardType,
  Simulator,
} from '@ptcg/common';

import { Meowth } from '../../../src/ex-sets/set-firered-and-leafgreen/meowth';
import { TestCard } from '../../test-cards/test-card';
import { TestUtils } from '../../test-utils';

describe('Meowth RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Meowth()],
      [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  it('Should use Collect - draw a card', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.hand.cards = [];
    player.deck.cards = [new TestCard()];

    sim.dispatch(new AttackAction(1, 'Collect'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(player.hand.cards).toEqual([new TestCard()]);
    expect(player.deck.cards).toEqual([]);
  });

  it('Should use Cat Kick - 20 damage', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Cat Kick'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
  });

});
