import {
  AttackAction,
  CardType,
  GameMessage,
  PokemonSlot,
  ResolvePromptAction,
  Simulator,
  SlotType
} from '@ptcg/common';

import { Doduo } from '../../../src/ex-sets/set-firered-and-leafgreen/doduo';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from "../../test-utils";

describe('Doduo RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Doduo()],
      [CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  // Run Around () - Switch Doduo with 1 of your Benched Pokémon.
  it('Should use Run Around attack', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    // attack
    sim.dispatch(new AttackAction(1, 'Run Around'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    // Choose Pokemon
    const selected: PokemonSlot[] = [player.bench[0]];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, selected));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(player.active).toEqual(TestUtils.pokemonSlot([new TestPokemon()]));
    expect(player.bench[0]).toEqual(TestUtils.pokemonSlot(
      [new Doduo()],
      [CardType.COLORLESS, CardType.COLORLESS]
    ));
  });

  it('Should use Run Around attack - canceled', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    // attack
    sim.dispatch(new AttackAction(1, 'Run Around'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    // Cancel (not possible)
    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(player.active).toEqual(TestUtils.pokemonSlot(
      [new Doduo()],
      [CardType.COLORLESS, CardType.COLORLESS]
    ));
    expect(player.bench[0]).toEqual(TestUtils.pokemonSlot([new TestPokemon()]));
  });

  it('Should use Run Around attack - no benched', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Run Around'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
  });

  // Random Peck (10+) - Flip 2 coins. This attack does 10 damage plus 10 more damage for each heads.
  it('Should use Random Peck attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Random Peck'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
  });

  it('Should use Random Peck attack - tails', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false]);

    // attack
    sim.dispatch(new AttackAction(1, 'Random Peck'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

});
