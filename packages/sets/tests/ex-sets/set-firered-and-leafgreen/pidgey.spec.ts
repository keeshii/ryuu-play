import {
  AttackAction,
  CardType,
  GameMessage,
  RetreatAction,
  Simulator,
} from '@ptcg/common';

import { Pidgey } from '../../../src/ex-sets/set-firered-and-leafgreen/pidgey';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Pidgey RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Pidgey()],
      [CardType.COLORLESS, CardType.COLORLESS]
    );
  });

  it('Should use Corner and block retreat until the end of opponent\'s next turn', () => {
    const { opponent } = TestUtils.getAll(sim);
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    sim.dispatch(new AttackAction(1, 'Corner'));

    let message = '';
    try {
      sim.dispatch(new RetreatAction(2, 0));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(message).toEqual(GameMessage.BLOCKED_BY_EFFECT);
    expect(opponent.active.damage).toEqual(0);
  });

  it('Should use Gust and deal 20 damage', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Gust'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
  });
});
