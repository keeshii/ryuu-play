import {
  AttackAction,
  CardType,
  Simulator,
} from '@ptcg/common';

import { Nidorino } from '../../../src/ex-sets/set-firered-and-leafgreen/nidorino';
import { TestUtils } from '../../test-utils';

describe('Nidorino RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Nidorino()],
      [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  // Double Stab attack tests (1 COLORLESS cost, flip 2 coins for 20× damage)
  it('Should use Double Stab - 2 heads (40 damage)', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [true, true]);

    sim.dispatch(new AttackAction(1, 'Double Stab'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
  });

  it('Should use Double Stab - 1 head (20 damage)', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [true, false]);

    sim.dispatch(new AttackAction(1, 'Double Stab'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
  });

  it('Should use Double Stab - 0 heads (0 damage)', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false, false]);

    sim.dispatch(new AttackAction(1, 'Double Stab'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
  });

  // Rend attack tests (3 COLORLESS cost, 30+ damage, +30 if opponent has damage)
  it('Should use Rend - no damage on opponent (30 damage)', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Rend'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
  });

  it('Should use Rend - opponent has damage (60 damage)', () => {
    const { opponent } = TestUtils.getAll(sim);
    opponent.active.damage = 10;

    // Now use Rend which should do 30 + 30 = 60
    sim.dispatch(new AttackAction(1, 'Rend'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(70); // 10 + 60
  });

});
