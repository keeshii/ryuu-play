import { AttackAction, CardType, Simulator } from '@ptcg/common';

import { Zekrom } from '../../../src/standard/set-black-and-white/zekrom';
import { TestUtils } from '../../test-utils';

describe('Zekrom BW', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [ new Zekrom() ],
      [ CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS ]
    );
  });

  it('Should use Outrage to deal 20 plus damage counters on Zekrom', () => {
    const { player, opponent } = TestUtils.getAll(sim);
    player.active.damage = 30;

    sim.dispatch(new AttackAction(1, 'Outrage'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(50);
    expect(player.active.damage).toEqual(30);
  });

  it('Should use Bolt Strike to deal 120 damage to opponent and 40 to self', () => {
    const { player, opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Bolt Strike'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(120);
    expect(player.active.damage).toEqual(40);
  });
});
