import {
  AttackAction,
  CardType,
  Simulator
} from "@ptcg/common";
import { Charmander3 } from "../../../src/ex-sets/set-firered-and-leafgreen/charmander-3";

import { TestUtils } from "../../test-utils";

describe('Charmander RG-3', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [ new Charmander3() ],
      [ CardType.FIRE, CardType.COLORLESS ]
    );
  });

  it('Should use Flare', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Flare'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

  it('Should use Rage', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.active.damage = 30;

    // attack
    sim.dispatch(new AttackAction(1, 'Rage'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
  });

});
