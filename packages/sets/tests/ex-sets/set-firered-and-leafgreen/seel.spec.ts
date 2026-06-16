import {
  AttackAction,
  CardType,
  Simulator,
} from '@ptcg/common';
import { Seel } from '../../../src/ex-sets/set-firered-and-leafgreen/seel';
import { TestUtils } from '../../test-utils';

describe('Seel RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Seel()],
      [CardType.WATER]
    );
  });

  it('Should use Horn Hazard and do 30 damage on heads', () => {
    const { opponent } = TestUtils.getAll(sim);

    TestUtils.setFlipResults(sim, [true]);
    sim.dispatch(new AttackAction(1, 'Horn Hazard'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
  });

  it('Should use Horn Hazard and do nothing on tails', () => {
    const { opponent } = TestUtils.getAll(sim);

    TestUtils.setFlipResults(sim, [false]);
    sim.dispatch(new AttackAction(1, 'Horn Hazard'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
  });
});
