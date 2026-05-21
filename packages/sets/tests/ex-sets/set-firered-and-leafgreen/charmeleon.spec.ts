import {
  AttackAction,
  CardType,
  Simulator
} from "@ptcg/common";
import { Charmeleon } from "../../../src/ex-sets/set-firered-and-leafgreen/charmeleon";

import { TestUtils } from "../../test-utils";

describe('Charmeleon RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [ new Charmeleon() ],
      [ CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS ]
    );
  });

  it('Should use Flare', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Flare'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
  });

  it('Should use Damage Burn - no damage', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Damage Burn'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
  });

  it('Should use Damage Burn - with damage', () => {
    const { opponent } = TestUtils.getAll(sim);
    opponent.active.damage = 10;

    // attack
    sim.dispatch(new AttackAction(1, 'Damage Burn'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(70);
  });

});
