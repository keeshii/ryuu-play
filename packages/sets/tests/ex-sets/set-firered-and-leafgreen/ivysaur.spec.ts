import {
  AttackAction,
  CardType,
  Simulator,
  SpecialCondition
} from '@ptcg/common';

import { Ivysaur } from '../../../src/ex-sets/set-firered-and-leafgreen/ivysaur';
import { TestUtils } from "../../test-utils";

describe('Ivysaur RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Ivysaur()],
      [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
    );
  });

  // Poison Seed () - The Defending Pokémon is now Poisoned.
  it('Should use Poison Seed attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Poison Seed'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.POISONED]);
  });

  // Razor Leaf (50)
  it('Should use Razor Leaf attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Razor Leaf'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(50);
  });

});
