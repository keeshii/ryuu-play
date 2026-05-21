import {
  AttackAction,
  CardType,
  Simulator,
  SpecialCondition
} from "@ptcg/common";
import { Chansey } from "../../../src/ex-sets/set-firered-and-leafgreen/chansey";

import { TestUtils } from "../../test-utils";

describe('Chansey RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [ new Chansey() ],
      [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ]
    );
  });

  it('Should use Sing', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false]); // so, the opponent remains asleep

    // attack
    sim.dispatch(new AttackAction(1, 'Sing'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.ASLEEP]);
    expect(opponent.active.damage).toEqual(0);
  });

  it('Should use Egg Surprise - heads', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.active.damage = 60;

    // attack
    sim.dispatch(new AttackAction(1, 'Egg Surprise'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.damage).toEqual(60);
    expect(opponent.active.damage).toEqual(50);
  });

  it('Should use Egg Surprise - tails', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false]);
    player.active.damage = 60;

    // attack
    sim.dispatch(new AttackAction(1, 'Egg Surprise'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.damage).toEqual(10);
    expect(opponent.active.damage).toEqual(0);
  });

});
