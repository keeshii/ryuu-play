import {
  AttackAction,
  CardType,
  Simulator,
} from "@ptcg/common";

import { Arcanine } from "../../../src/ex-sets/set-firered-and-leafgreen/arcanine";
import { TestUtils } from "../../test-utils";

describe('Arcanine RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [ new Arcanine() ],
      [ CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ]
    );
  });

  it('Should use Flare', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Flare'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
  });

  it('Should use Heat Tackle', () => {
    const { player, opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Heat Tackle'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.damage).toEqual(10);
    expect(opponent.active.damage).toEqual(70);
  });

});
