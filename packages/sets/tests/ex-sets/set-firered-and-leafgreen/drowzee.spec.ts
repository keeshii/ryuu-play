import {
  AttackAction,
  CardType,
  Simulator,
  SpecialCondition
} from '@ptcg/common';

import { Drowzee } from '../../../src/ex-sets/set-firered-and-leafgreen/drowzee';
import { TestUtils } from "../../test-utils";

describe('Drowzee RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Drowzee()],
      [CardType.PSYCHIC],
    );
  });

  // Hypnosis () - The Defending Pokémon is now Asleep.
  it('Should use Hypnosis attack', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false]); // so, the opponent remains asleep

    // attack
    sim.dispatch(new AttackAction(1, 'Hypnosis'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.ASLEEP]);
    expect(opponent.active.damage).toEqual(0);
  });

  // Ambush (10+) - Flip a coin. If heads, this attack does 10 damage plus 10 more damage.
  it('Should use Ambush attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Ambush'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
  });

  it('Should use Ambush attack - tails', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false]);

    // attack
    sim.dispatch(new AttackAction(1, 'Ambush'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

});
