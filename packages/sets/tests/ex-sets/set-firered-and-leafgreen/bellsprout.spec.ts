import {
  AttackAction,
  CardType,
  Simulator
} from "@ptcg/common";
import { Bellsprout } from "../../../src/ex-sets/set-firered-and-leafgreen/bellsprout";

import { TestUtils } from "../../test-utils";

describe('Bellsprout RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [ new Bellsprout() ],
      [ CardType.GRASS ]
    );
  });

  it('Should use Vine Whip', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Vine Whip'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

});
