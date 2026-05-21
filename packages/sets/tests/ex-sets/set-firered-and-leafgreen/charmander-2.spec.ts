import {
  AttackAction,
  CardType,
  Simulator
} from "@ptcg/common";
import { Charmander2 } from "../../../src/ex-sets/set-firered-and-leafgreen/charmander-2";

import { TestUtils } from "../../test-utils";

describe('Charmander RG-2', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [ new Charmander2() ],
      [ CardType.COLORLESS, CardType.COLORLESS ]
    );
  });

  it('Should use Headbutt', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Headbutt'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

  it('Should use Slash', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Slash'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
  });

});
