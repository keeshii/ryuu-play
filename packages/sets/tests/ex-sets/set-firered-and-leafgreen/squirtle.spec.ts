import { AttackAction, CardType, Simulator, SpecialCondition } from '@ptcg/common';
import { Squirtle } from '../../../src/ex-sets/set-firered-and-leafgreen/squirtle';
import { TestUtils } from '../../test-utils';

describe('Squirtle RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Squirtle()],
      [CardType.WATER]
    );
  });

  it('Should use Sleepy Ball and put the Defending Pokémon to sleep on heads', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [true, false]);

    sim.dispatch(new AttackAction(1, 'Sleepy Ball'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.ASLEEP]);
  });

  it('Should use Sleepy Ball and do not sleep on tails', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false]);

    sim.dispatch(new AttackAction(1, 'Sleepy Ball'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
    expect(opponent.active.specialConditions).toEqual([]);
  });
});
