import {
  AttackAction,
  CardType,
  Simulator,
  SpecialCondition
} from "@ptcg/common";
import { Bulbasaur } from "../../../src/ex-sets/set-firered-and-leafgreen/bulbasaur";

import { TestUtils } from "../../test-utils";

describe('Bulbasaur RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [ new Bulbasaur() ],
      [ CardType.COLORLESS, CardType.COLORLESS ]
    );
  });

  it('Should use Sleep Poison - heads', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Sleep Poison'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.POISONED]);
    expect(opponent.active.damage).toEqual(10);
  });

  it('Should use Sleep Poison - tails', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false]);

    // attack
    sim.dispatch(new AttackAction(1, 'Sleep Poison'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
  });

  it('Should use Razor Leaf', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Razor Leaf'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
  });


});
