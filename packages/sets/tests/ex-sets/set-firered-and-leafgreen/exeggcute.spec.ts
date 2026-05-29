import {
  AttackAction,
  CardType,
  Simulator,
  SpecialCondition
} from '@ptcg/common';

import { Exeggcute } from '../../../src/ex-sets/set-firered-and-leafgreen/exeggcute';
import { TestUtils } from "../../test-utils";

describe('Exeggcute RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Exeggcute()],
      [CardType.PSYCHIC, CardType.COLORLESS],
    );
  });

  // Psybeam (10) - Flip a coin. If heads, the Defending Pokémon is now Confused.
  it('Should use Psybeam attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Psybeam'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.CONFUSED]);
  });

  it('Should use Psybeam attack - tails', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false]);

    // attack
    sim.dispatch(new AttackAction(1, 'Psybeam'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
    expect(opponent.active.specialConditions).toEqual([]);
  });

  // Double Spin (20×) - Flip 2 coins. This attack does 20 damage times the number of heads.
  it('Should use Double Spin attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Double Spin'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
  });

  it('Should use Double Spin attack - head, tails', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [true, false]);

    // attack
    sim.dispatch(new AttackAction(1, 'Double Spin'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
  });

  it('Should use Double Spin attack - 2x tails', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false, false]);

    // attack
    sim.dispatch(new AttackAction(1, 'Double Spin'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
  });

});
