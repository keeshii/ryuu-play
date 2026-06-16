import {
  AttackAction,
  CardType,
  Simulator,
} from '@ptcg/common';
import { Shellder } from '../../../src/ex-sets/set-firered-and-leafgreen/shellder';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

class TestPokemonDamageShellder extends TestPokemon {
  public attacks = [
    {
      name: 'Test attack',
      cost: [],
      damage: '30',
      text: ''
    },
  ];
}

describe('Shellder RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Shellder()],
      [CardType.WATER]
    );
  });

  it('Should use Minimize and reduce damage by 20 during opponent next turn', () => {
    const { player, opponent } = TestUtils.getAll(sim);

    TestUtils.setDefending(sim, [new TestPokemonDamageShellder()]);

    sim.dispatch(new AttackAction(1, 'Minimize'));
    sim.dispatch(new AttackAction(2, 'Test attack'));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(10);
    expect(opponent.active.damage).toEqual(0);
  });

  it('Should use Wave Splash and deal 10 damage', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Wave Splash'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });
});
