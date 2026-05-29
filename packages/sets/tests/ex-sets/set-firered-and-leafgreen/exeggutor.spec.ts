import {
  AttackAction,
  CardList,
  CardType,
  GameMessage,
  ResolvePromptAction,
  Simulator,
} from '@ptcg/common';

import { Exeggutor } from '../../../src/ex-sets/set-firered-and-leafgreen/exeggutor';
import { TestUtils } from "../../test-utils";

describe('Exeggutor RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Exeggutor()],
      [CardType.PSYCHIC, CardType.COLORLESS],
    );
  });

  // Psychic Exchange () - Shuffle your hand into your deck. Draw up to 8 cards.
  it('Should use Psychic Exchange attack', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    player.hand.cards = TestUtils.makeTestCards(5);
    TestUtils.setCardIds(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Psychic Exchange'));

    const deckTop = new CardList();
    deckTop.cards = player.deck.top(8);

    // Choose card prompt
    expect(prompts.length).toEqual(2);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Shuffle deck',
      playerId: player.id,
    }));

    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_HAND,
      cards: deckTop,
      options: jasmine.objectContaining({ min: 0, max: deckTop.cards.length, allowCancel: true, isSecret: true })
    }));

    // Choose card
    sim.dispatch(new ResolvePromptAction(prompts[1].id, deckTop.cards));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(player.hand.cards).toEqual(deckTop.cards);
  });

  it('Should use Psychic Exchange attack - canceled', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    player.hand.cards = TestUtils.makeTestCards(5);
    TestUtils.setCardIds(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Psychic Exchange'));

    const deckTop = new CardList();
    deckTop.cards = player.deck.top(8);

    // Choose card prompt
    expect(prompts.length).toEqual(2);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Shuffle deck',
      playerId: player.id,
    }));

    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_HAND,
      cards: deckTop,
      options: jasmine.objectContaining({ min: 0, max: deckTop.cards.length, allowCancel: true, isSecret: true })
    }));

    // Choose card
    sim.dispatch(new ResolvePromptAction(prompts[1].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(player.hand.cards).toEqual([]);
  });

  it('Should use Psychic Exchange attack - empty deck', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.deck.cards = [];
    TestUtils.setCardIds(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Psychic Exchange'));

    // No prompt

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(player.hand.cards).toEqual([]);
  });

  // Big Eggsplosion (40×) - Flip a coin for each Energy attached to Exeggutor. This attack does 40 damage times
  // the number of heads.
  it('Should use Big Eggsplosion attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Big Eggsplosion'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(80);
  });

  it('Should use Big Eggsplosion attack - three energies attached', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    player.active.energies.cards = TestUtils.makeEnergies([CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS]);

    // attack
    sim.dispatch(new AttackAction(1, 'Big Eggsplosion'));

    expect(prompts.length).toEqual(3);
    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(120);
  });

  it('Should use Big Eggsplosion attack - head, tails', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [true, false]);

    // attack
    sim.dispatch(new AttackAction(1, 'Big Eggsplosion'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
  });

  it('Should use Big Eggsplosion attack - 2x tails', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false, false]);

    // attack
    sim.dispatch(new AttackAction(1, 'Big Eggsplosion'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
  });

});
