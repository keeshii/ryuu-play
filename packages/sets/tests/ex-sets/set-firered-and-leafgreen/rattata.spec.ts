import {
  AttackAction,
  CardType,
  Simulator,
} from '@ptcg/common';
import { Rattata } from '../../../src/ex-sets/set-firered-and-leafgreen/rattata';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Rattata RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Rattata()],
      [CardType.COLORLESS]
    );
  });

  it('Should use Collect attack and draw a card', () => {
    const { player, opponent } = TestUtils.getAll(sim);
    const drawnCard = new TestPokemon();
    player.deck.cards = [drawnCard, ...player.deck.cards];

    sim.dispatch(new AttackAction(1, 'Collect'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.hand.cards).toContain(drawnCard);
    expect(player.deck.cards).not.toContain(drawnCard);
  });

  it('Should use Scratch attack and deal 10 damage', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Scratch'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });
});
