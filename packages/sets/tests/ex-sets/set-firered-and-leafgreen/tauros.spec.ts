import {
  AttackAction,
  ResolvePromptAction,
  CardType,
  GameMessage,
  Simulator,
  SpecialCondition,
} from '@ptcg/common';
import { Tauros } from '../../../src/ex-sets/set-firered-and-leafgreen/tauros';
import { TestCard } from '../../test-cards/test-card';
import { TestUtils } from '../../test-utils';

describe('Tauros RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Tauros()],
      [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS]
    );
  });

  it('Knock Over does nothing when there is no Stadium', () => {
    const { prompts } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Knock Over'));

    expect(prompts.length).toEqual(0);
  });

  it('Knock Over prompts to discard Stadium when present and discards on confirm', () => {
    const state = sim.store.state;
    const stadium = new TestCard();
    state.players[0].stadium.cards = [stadium];

    sim.dispatch(new AttackAction(1, 'Knock Over'));

    const { player, prompts } = TestUtils.getAll(sim);
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Confirm',
      playerId: player.id,
      message: GameMessage.WANT_TO_DISCARD_STADIUM,
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, true));

    expect(state.players[0].stadium.cards).toEqual([]);
    expect(player.discard.cards).toEqual([stadium]);
  });

  it('Knock Over does not discard Stadium when player says no', () => {
    const state = sim.store.state;
    const stadium = new TestCard();
    state.players[0].stadium.cards = [stadium];

    sim.dispatch(new AttackAction(1, 'Knock Over'));

    const { player, prompts } = TestUtils.getAll(sim);
    expect(prompts.length).toEqual(1);

    sim.dispatch(new ResolvePromptAction(prompts[0].id, false));

    expect(player.discard.cards).toEqual([]);
    expect(state.players[0].stadium.cards).toEqual([stadium]);
  });

  it('Rampage does 20 + current damage on Tauros and confuses on tails', () => {
    const { player, opponent } = TestUtils.getAll(sim);

    // Give Tauros 30 damage already -> +30
    player.active.damage = 30;

    TestUtils.setFlipResults(sim, [false]); // tails -> confused

    sim.dispatch(new AttackAction(1, 'Rampage'));

    expect(opponent.active.damage).toEqual(20 + 30);
    expect(player.active.specialConditions).toEqual([SpecialCondition.CONFUSED]);
  });

  it('Rampage does 20 + current damage on Tauros and does not confuse on heads', () => {
    const { player, opponent } = TestUtils.getAll(sim);

    player.active.damage = 10;

    TestUtils.setFlipResults(sim, [true]); // heads -> no confuse

    sim.dispatch(new AttackAction(1, 'Rampage'));

    expect(opponent.active.damage).toEqual(20 + 10);
    expect(player.active.specialConditions).toEqual([]);
  });
});
