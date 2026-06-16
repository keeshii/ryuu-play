import { AttackAction, CardType, Simulator, SpecialCondition } from '@ptcg/common';
import { Slowpoke } from '../../../src/ex-sets/set-firered-and-leafgreen/slowpoke';
import { TestUtils } from '../../test-utils';

describe('Slowpoke RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Slowpoke()],
      [CardType.PSYCHIC]
    );
  });

  it('Should use Confusion Wave and confuse both Slowpoke and the Defending Pokémon', () => {
    const { player, opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Confusion Wave'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.CONFUSED]);
    expect(player.active.specialConditions).toEqual([SpecialCondition.CONFUSED]);
  });
});
