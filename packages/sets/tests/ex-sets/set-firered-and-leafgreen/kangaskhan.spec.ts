import {
  AttackAction,
  CardType,
  Simulator,
} from '@ptcg/common';

import { Kangaskhan } from '../../../src/ex-sets/set-firered-and-leafgreen/kangaskhan';
import { TestCard } from '../../test-cards/test-card';
import { TestUtils } from "../../test-utils";

describe('Kangaskhan RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Kangaskhan()],
      [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  // Fetch () - Draw a card.
  it('Should use Fetch attack', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.hand.cards = [];
    player.deck.cards = [new TestCard()];

    // attack
    sim.dispatch(new AttackAction(1, 'Fetch'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(player.hand.cards).toEqual([new TestCard()]);
    expect(player.deck.cards).toEqual([]);
  });

  // Headbutt (20)
  it('Should use Headbutt attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Headbutt'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
  });

  // One-Two Punch (30+) - Flip a coin. If heads, this attack does 30 damage plus 20 more damage.
  it('Should use One-Two Punch attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'One-Two Punch'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(50);
  });

  it('Should use One-Two Punch attack - tails', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false]);

    // attack
    sim.dispatch(new AttackAction(1, 'One-Two Punch'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
  });

});
