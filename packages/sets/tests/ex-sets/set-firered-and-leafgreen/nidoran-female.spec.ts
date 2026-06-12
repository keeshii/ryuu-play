import {
  AttackAction,
  CardType,
  GameMessage,
  ResolvePromptAction,
  Simulator,
} from '@ptcg/common';

import { NidoranFemale } from '../../../src/ex-sets/set-firered-and-leafgreen/nidoran-female';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Nidoran Female RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new NidoranFemale()],
      [CardType.GRASS, CardType.COLORLESS],
    );
  });

  it('Should use Bite attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Bite'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
  });

  it('Should use Look for Friends and add a Basic Pokémon to hand', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const basicPokemon = new TestPokemon();

    player.deck.cards = [basicPokemon];

    sim.dispatch(new AttackAction(1, 'Look for Friends'));

    expect(prompts.length).toEqual(2);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Show cards',
      playerId: player.id,
      message: GameMessage.CARDS_SHOWED_BY_EFFECT,
      cards: [basicPokemon],
    }));
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Show cards',
      playerId: opponent.id,
      message: GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards: [basicPokemon],
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, true));
    sim.dispatch(new ResolvePromptAction(prompts[1].id, true));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.hand.cards).toEqual([basicPokemon]);
    expect(player.deck.cards).toEqual([]);
  });

  it('Should use Look for Friends with an empty deck', () => {
    const { opponent, player } = TestUtils.getAll(sim);

    player.deck.cards = [];

    sim.dispatch(new AttackAction(1, 'Look for Friends'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.hand.cards).toEqual([]);
  });
});
