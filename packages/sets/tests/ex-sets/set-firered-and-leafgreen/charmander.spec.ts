import {
  AttackAction,
  CardType,
  Simulator,
  SpecialCondition
} from "@ptcg/common";
import { Charmander } from "../../../src/ex-sets/set-firered-and-leafgreen/charmander";

import { TestUtils } from "../../test-utils";

describe('Charmander RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [ new Charmander() ],
      [ CardType.FIRE ]
    );
  });

  it('Should use Singe', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Singe'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.BURNED]);
  });

});
