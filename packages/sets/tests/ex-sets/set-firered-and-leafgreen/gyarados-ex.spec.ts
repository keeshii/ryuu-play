import {
  AttackAction,
  CardType,
  GameMessage,
  ResolvePromptAction,
  Simulator,
} from '@ptcg/common';

import { GyaradosEx } from '../../../src/ex-sets/set-firered-and-leafgreen/gyarados-ex';
import { TestUtils } from "../../test-utils";

describe('Gyarados ex RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new GyaradosEx()],
      [CardType.WATER, CardType.WATER, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  // Twister (40) - Flip 2 coins. For each heads, choose 1 Energy attached to the Defending Pokémon, if any, and
  // discard it. If both are tails, this attack does nothing.
  it('Should use Twister attack - 2x heads', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [true, true]);
    opponent.active.energies.cards = TestUtils.makeEnergies([CardType.WATER, CardType.WATER]);

    // attack
    sim.dispatch(new AttackAction(1, 'Twister'));

    // Pidgeotto's "Twister" attack says to discard an Energy attached to
    // the Defending Pokemon for each heads flipped. Does that mean if I only
    // flip one heads I cannot discard a Double Colorless Energy?
    //
    // Actually, you can discard a DCE with a single heads. It's like paying
    // a Retreat Cost with an Energy Card that has more energy than required
    // to retreat. Total the number of flips, then discard Energy Cards one at
    // a time until the condition has been met. So if you flip one heads you
    // can discard a single Energy Card with one or more energy on it.
    // But if you flip two heads you can either choose a card with one energy
    // then another card with one or more energy, or you can choose a single
    // card with two or more energy on it.

    // Choose energy prompt
    expect(prompts.length).toEqual(3);
    expect(prompts[2]).toEqual(jasmine.objectContaining({
      type: 'Choose energy',
      playerId: player.id,
      message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    // Choose card
    const energyMap = [
      { card: opponent.active.energies.cards[0], provides: [CardType.WATER] },
      { card: opponent.active.energies.cards[1], provides: [CardType.WATER] }
    ];
    sim.dispatch(new ResolvePromptAction(prompts[2].id, energyMap));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
    expect(opponent.active.energies.cards).toEqual([]);
    expect(opponent.discard.cards).toEqual(TestUtils.makeEnergies([CardType.WATER, CardType.WATER]));
  });

  it('Should use Twister attack - head, tail', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [true, false]);
    opponent.active.energies.cards = TestUtils.makeEnergies([CardType.WATER, CardType.WATER]);

    // attack
    sim.dispatch(new AttackAction(1, 'Twister'));

    // Choose energy prompt
    expect(prompts.length).toEqual(3);
    expect(prompts[2]).toEqual(jasmine.objectContaining({
      type: 'Choose energy',
      playerId: player.id,
      message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      cost: [CardType.COLORLESS],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    // Choose card
    const energyMap = [{ card: opponent.active.energies.cards[0], provides: [CardType.WATER] }];
    sim.dispatch(new ResolvePromptAction(prompts[2].id, energyMap));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
    expect(opponent.active.energies.cards).toEqual(TestUtils.makeEnergies([CardType.WATER]));
    expect(opponent.discard.cards).toEqual(TestUtils.makeEnergies([CardType.WATER]));
  });

  it('Should use Twister attack - canceled', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [true, true]);
    opponent.active.energies.cards = TestUtils.makeEnergies([CardType.WATER, CardType.WATER]);

    // attack
    sim.dispatch(new AttackAction(1, 'Twister'));

    // Choose energy prompt
    expect(prompts.length).toEqual(3);
    expect(prompts[2]).toEqual(jasmine.objectContaining({
      type: 'Choose energy',
      playerId: player.id,
      message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    // Choose card, illegal move
    sim.dispatch(new ResolvePromptAction(prompts[2].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
    expect(opponent.active.energies.cards).toEqual(TestUtils.makeEnergies([CardType.WATER, CardType.WATER]));
    expect(opponent.discard.cards).toEqual([]);
  });

  it('Should use Twister attack - 2x heads, no energies to discard', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [true, true]);

    // attack
    sim.dispatch(new AttackAction(1, 'Twister'));

    // No prompt required

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
  });

  it('Should use Twister attack - 2x tails', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false, false]);

    // attack
    sim.dispatch(new AttackAction(1, 'Twister'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
  });

  // Dragon Rage (100)
  it('Should use Dragon Rage attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Dragon Rage'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(100);
  });

});
