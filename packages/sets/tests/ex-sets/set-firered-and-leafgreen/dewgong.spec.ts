import {
  AttackAction,
  CardType,
  Simulator,
  SpecialCondition
} from '@ptcg/common';

import { Dewgong } from '../../../src/ex-sets/set-firered-and-leafgreen/dewgong';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestPokemonEx } from '../../test-cards/test-pokemon-ex';
import { TestUtils } from "../../test-utils";

describe('Dewgong RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Dewgong()],
      [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  it('Should use Safeguard ability', () => {
    const { opponent } = TestUtils.getAll(sim);
    const testPokemonEx = new TestPokemonEx();
    TestUtils.setActive(sim, [testPokemonEx]);
    TestUtils.setDefending(sim, [new Dewgong()]);

    // attack
    sim.dispatch(new AttackAction(1, 'Test attack'));

    // ability
    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
  });

  it('Should use Safeguard ability - not pokemon ex', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [new TestPokemon()]);
    TestUtils.setDefending(sim, [new Dewgong()]);

    // attack
    sim.dispatch(new AttackAction(1, 'Test attack'));

    // ability
    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

  it('Should use Safeguard ability - blocked', () => {
    const { opponent } = TestUtils.getAll(sim);
    const testPokemonEx = new TestPokemonEx();
    TestUtils.setActive(sim, [testPokemonEx]);
    TestUtils.setDefending(sim, [new Dewgong()]);
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);

    // attack
    sim.dispatch(new AttackAction(1, 'Test attack'));

    // ability
    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

  it('Should use Safeguard ability - cloyser has evolved', () => {
    const { opponent } = TestUtils.getAll(sim);
    const testPokemonEx = new TestPokemonEx();
    TestUtils.setActive(sim, [testPokemonEx]);
    TestUtils.setDefending(sim, [new Dewgong(), new TestPokemon()]);

    // attack
    sim.dispatch(new AttackAction(1, 'Test attack'));

    // ability
    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

  // Cold Breath (10) - The Defending Pokémon is now Asleep.
  it('Should use Cold Breath attack', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false]); // so the opponent remains asleep

    // attack
    sim.dispatch(new AttackAction(1, 'Cold Breath'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.ASLEEP]);
  });

  // Aurora Beam (40)
  it('Should use Aurora Beam attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Aurora Beam'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
  });

});
