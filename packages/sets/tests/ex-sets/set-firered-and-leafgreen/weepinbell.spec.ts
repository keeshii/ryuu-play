import {
  AttackAction,
  CardType,
  Simulator,
  SpecialCondition,
} from '@ptcg/common';

import { Weepinbell } from '../../../src/ex-sets/set-firered-and-leafgreen/weepinbell';
import { TestUtils } from "../../test-utils";

describe('Weepinbell RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Weepinbell()],
      [CardType.GRASS, CardType.COLORLESS],
    );
  });

  // Razor Leaf (20)
  it('Should use Razor Leaf attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Razor Leaf'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
  });

  // Corrosive Acid (10) - The Defending Pokémon is now Burned.
  it('Should use Corrosive Acid attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Corrosive Acid'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.BURNED]);
  });

});
