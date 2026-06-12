import { AttackAction, CardType, Simulator } from '@ptcg/common';

import { Krabby } from '../../../src/ex-sets/set-firered-and-leafgreen/krabby';
import { TestUtils } from '../../test-utils';

describe('Krabby RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Krabby()],
      [CardType.WATER],
    );
  });

  it('Should use Irongrip attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Irongrip'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

  it('Should use Nap attack', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.active.damage = 30;

    sim.dispatch(new AttackAction(1, 'Nap'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.damage).toEqual(10);
  });

  it('Should use Nap attack - remove only one damage counter when damaged once', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.active.damage = 10;

    sim.dispatch(new AttackAction(1, 'Nap'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.damage).toEqual(0);
  });
});
