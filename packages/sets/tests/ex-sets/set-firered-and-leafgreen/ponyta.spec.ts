import {
  AttackAction,
  CardType,
  Simulator,
} from '@ptcg/common';

import { Ponyta } from '../../../src/ex-sets/set-firered-and-leafgreen/ponyta';
import { TestUtils } from '../../test-utils';

describe('Ponyta RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Ponyta()],
      [CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  it('Should use Stomp and deal 30 damage on heads', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Stomp'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
  });

  it('Should use Stomp and deal 20 damage on tails', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false]);

    sim.dispatch(new AttackAction(1, 'Stomp'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
  });
});
