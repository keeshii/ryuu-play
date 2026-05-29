import {
  AttackAction,
  CardType,
  GameMessage,
  PlayerType,
  PokemonSlot,
  ResolvePromptAction,
  Simulator,
  SlotType,
  SpecialCondition
} from '@ptcg/common';

import { Jigglypuff } from '../../../src/ex-sets/set-firered-and-leafgreen/jigglypuff';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from "../../test-utils";

describe('Jigglypuff RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Jigglypuff()],
      [CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  // Sleep Inducer () - Switch 1 of your opponent's Benched Pokémon with 1 of the Defending Pokémon. Your opponent
  // chooses the Defending Pokémon to switch. The new Defending Pokémon is now Asleep.
  it('Should use Sleep Inducer attack', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    TestUtils.setCardIds(sim);
    TestUtils.setFlipResults(sim, [false]); // so pokemon remains asleep
    const defending = opponent.active;
    const benched = opponent.bench[0];

    // attack
    sim.dispatch(new AttackAction(1, 'Sleep Inducer'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_SWITCH,
      playerType: PlayerType.TOP_PLAYER,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    // Choose Pokemon
    const selected: PokemonSlot[] = [benched];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, selected));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active).toBe(benched);
    expect(opponent.bench[0]).toBe(defending);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.ASLEEP]);
  });

  it('Should use Sleep Inducer attack - no bench', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false]);

    // attack
    sim.dispatch(new AttackAction(1, 'Sleep Inducer'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(opponent.active.specialConditions).toEqual([]);
  });

  // Quick Blow (10+) - Flip a coin. If heads, this attack does 10 damage plus 20 more damage.
  it('Should use Quick Blow attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Quick Blow'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
  });

  it('Should use Quick Blow attack - tails', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false]); // so pokemon remains asleep

    // attack
    sim.dispatch(new AttackAction(1, 'Quick Blow'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

});
