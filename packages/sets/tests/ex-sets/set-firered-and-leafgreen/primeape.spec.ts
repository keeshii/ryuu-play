import {
  AttackAction,
  CardType,
  ChooseCardsPrompt,
  ResolvePromptAction,
  Simulator,
  SuperType,
  TrainerCard,
  TrainerType,
} from '@ptcg/common';

import { Primeape } from '../../../src/ex-sets/set-firered-and-leafgreen/primeape';
import { TestUtils } from '../../test-utils';

class TestTool extends TrainerCard {
  public set = 'TEST';
  public trainerType: TrainerType = TrainerType.TOOL;

  public name = 'Tool';
  public fullName = 'Tool TEST';
}

describe('Primeape RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Primeape()],
      [CardType.FIGHTING, CardType.COLORLESS],
    );
  });

  // Toss (30×) - You may discard from your hand as many Technical Machine and Pokémon Tool cards as you like.
  // This attack does 30 damage times the number of cards you discarded.
  it('Should use Toss attack and discard 2 tools for 60 damage', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    const tool1 = new TestTool();
    const tool2 = new TestTool();
    player.hand.cards = [tool1, tool2];

    sim.dispatch(new AttackAction(1, 'Toss'));

    const prompt = TestUtils.lastPrompt(sim) as ChooseCardsPrompt;
    expect(prompt).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      filter: { superType: SuperType.TRAINER, trainerType: TrainerType.TOOL },
      options: jasmine.objectContaining({ allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompt.id, [tool1, tool2]));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(60);
    expect(player.discard.cards).toEqual([tool1, tool2]);
  });

  it('Should use Toss attack and discard 1 tool for 30 damage', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    const tool1 = new TestTool();
    const tool2 = new TestTool();
    player.hand.cards = [tool1, tool2];

    sim.dispatch(new AttackAction(1, 'Toss'));

    const prompt = TestUtils.lastPrompt(sim) as ChooseCardsPrompt;
    sim.dispatch(new ResolvePromptAction(prompt.id, [tool1]));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
    expect(player.discard.cards).toEqual([tool1]);
  });

  it('Should use Toss attack and discard no tools for 0 damage', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    const tool1 = new TestTool();
    player.hand.cards = [tool1];

    sim.dispatch(new AttackAction(1, 'Toss'));

    const prompt = TestUtils.lastPrompt(sim) as ChooseCardsPrompt;
    sim.dispatch(new ResolvePromptAction(prompt.id, []));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(player.discard.cards.length).toEqual(0);
  });

  it('Should use Toss attack and cancel prompt for 0 damage', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    const tool1 = new TestTool();
    player.hand.cards = [tool1];

    sim.dispatch(new AttackAction(1, 'Toss'));

    const prompt = TestUtils.lastPrompt(sim) as ChooseCardsPrompt;
    sim.dispatch(new ResolvePromptAction(prompt.id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(player.discard.cards.length).toEqual(0);
  });

  it('Should use Toss attack with no tools in hand', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Toss'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
  });

  // Low Kick (40)
  it('Should use Low Kick attack for 40 damage', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Low Kick'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
  });
});
