import {
  AttackAction,
  CardType,
  GameMessage,
  ResolvePromptAction,
  Simulator,
  SpecialCondition,
} from '@ptcg/common';
import { Tangela } from '../../../src/ex-sets/set-firered-and-leafgreen/tangela';
import { TestUtils } from '../../test-utils';

describe('Tangela RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Tangela()],
      [CardType.GRASS]
    );
  });

  it('Vine Tease does nothing when deck is empty', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    player.deck.cards = [];

    sim.dispatch(new AttackAction(1, 'Vine Tease'));

    expect(prompts.length).toEqual(0);
    expect(player.deck.cards.length).toEqual(0);
  });

  it('Vine Tease should prompt to choose a Prize card and swap with top deck card', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    TestUtils.setCardIds(sim);

    // Ensure deck has at least one card and grab top card and a prize card
    const topDeck = player.deck.cards[0];
    const prizeCard = player.prizes[0].cards[0];

    sim.dispatch(new AttackAction(1, 'Vine Tease'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_DECK,
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, [prizeCard]));

    // After resolving, prize card should be on top of deck and topDeck moved to prize
    expect(player.deck.cards[0]).toEqual(prizeCard);
    expect(player.prizes[0].cards[0]).toEqual(topDeck);
  });

  it('Vine Tease should prompt to choose a Prize card but canceled', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    TestUtils.setCardIds(sim);

    // Ensure deck has at least one card and grab top card and a prize card
    const topDeck = player.deck.cards[0];
    const prizeCard = player.prizes[0].cards[0];

    sim.dispatch(new AttackAction(1, 'Vine Tease'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_DECK,
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    // After resolving, prize card should be on top of deck and topDeck moved to prize
    expect(player.deck.cards[0]).toEqual(topDeck);
    expect(player.prizes[0].cards[0]).toEqual(prizeCard);
  });

  it('Wiggle should Confuse on heads', () => {
    const { opponent } = TestUtils.getAll(sim);

    TestUtils.setFlipResults(sim, [true]);
    sim.dispatch(new AttackAction(1, 'Wiggle'));

    expect(opponent.active.specialConditions).toEqual([SpecialCondition.CONFUSED]);
  });

  it('Wiggle should Poison on tails', () => {
    const { opponent } = TestUtils.getAll(sim);

    TestUtils.setFlipResults(sim, [false]);
    sim.dispatch(new AttackAction(1, 'Wiggle'));

    expect(opponent.active.specialConditions).toEqual([SpecialCondition.POISONED]);
  });
});
