import {
  AttackAction,
  CardType,
  Simulator,
} from '@ptcg/common';

import { Growlithe } from '../../../src/ex-sets/set-firered-and-leafgreen/growlithe';
import { TestUtils } from "../../test-utils";

describe('Growlithe RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Growlithe()],
      [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  // Bite (10)
  it('Should use Bite attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Bite'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

  // Flame Tail (40)
  it('Should use Flame Tail attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Flame Tail'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
  });

});
