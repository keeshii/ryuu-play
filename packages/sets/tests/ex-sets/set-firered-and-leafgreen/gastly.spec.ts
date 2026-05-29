import {
  AttackAction,
  CardType,
  PassTurnAction,
  Simulator,
  SpecialCondition
} from '@ptcg/common';

import { Gastly } from '../../../src/ex-sets/set-firered-and-leafgreen/gastly';
import { TestUtils } from "../../test-utils";

describe('Gastly RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Gastly()],
      [CardType.COLORLESS],
    );
  });

  // Slow Trip Gas () - At the end of your opponent's next turn, the Defending Pokémon is now Confused.
  it('Should use Slow Trip Gas attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Slow Trip Gas'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(opponent.active.specialConditions).toEqual([]);
  });

  it('Should use Slow Trip Gas attack - after opponent turn', () => {
    const { opponent, player } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Slow Trip Gas'));
    sim.dispatch(new PassTurnAction(2));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.CONFUSED]);
  });

});
