import {
  AttackAction,
  CardType,
  GameMessage,
  RetreatAction,
  Simulator,
} from '@ptcg/common';

import { Pidgeotto } from '../../../src/ex-sets/set-firered-and-leafgreen/pidgeotto';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Pidgeotto RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Pidgeotto()],
      [CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  it('Should use Clutch and block retreat until the end of opponent\'s next turn', () => {
    const { opponent } = TestUtils.getAll(sim);
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    sim.dispatch(new AttackAction(1, 'Clutch'));

    let message = '';
    try {
      sim.dispatch(new RetreatAction(2, 0));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(message).toEqual(GameMessage.BLOCKED_BY_EFFECT);
    expect(opponent.active.damage).toEqual(10);
  });

  it('Should use Cutting Wind and deal 30 damage', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Cutting Wind'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
  });
});
