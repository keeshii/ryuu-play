import {
  AttackAction,
  CardType,
  PassTurnAction,
  Simulator,
  SpecialCondition
} from '@ptcg/common';

import { Hypno } from '../../../src/ex-sets/set-firered-and-leafgreen/hypno';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestUtils } from "../../test-utils";

describe('Hypno RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Hypno()],
      [CardType.PSYCHIC, CardType.COLORLESS],
    );
  });

  // Eerie Aura - As long as Hypno is your Active Pokémon, put 2 damage counters on each Pokémon that remains
  // Asleep between turns.
  it('Should use Eerie Aura ability', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.active.specialConditions.push(SpecialCondition.ASLEEP);
    opponent.active.specialConditions.push(SpecialCondition.ASLEEP);
    TestUtils.setFlipResults(sim, [false]); // so pokemon remains asleep

    // ability
    sim.dispatch(new PassTurnAction(1));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.specialConditions).toEqual([SpecialCondition.ASLEEP]);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.ASLEEP]);
    expect(player.active.damage).toEqual(20);
    expect(opponent.active.damage).toEqual(20);
  });

  it('Should use Eerie Aura ability - wake up', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.active.specialConditions.push(SpecialCondition.ASLEEP);
    opponent.active.specialConditions.push(SpecialCondition.ASLEEP);
    TestUtils.setFlipResults(sim, [true]); // so pokemon remains asleep

    // ability
    sim.dispatch(new PassTurnAction(1));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.specialConditions).toEqual([]);
    expect(opponent.active.specialConditions).toEqual([]);
    expect(player.active.damage).toEqual(0);
    expect(opponent.active.damage).toEqual(0);
  });

  it('Should use Eerie Aura ability - blocked by special condition', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.active.specialConditions.push(SpecialCondition.ASLEEP);
    opponent.active.specialConditions.push(SpecialCondition.ASLEEP);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);
    TestUtils.setFlipResults(sim, [false]); // so pokemon remains asleep

    // ability
    sim.dispatch(new PassTurnAction(1));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.specialConditions).toEqual([SpecialCondition.ASLEEP]);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.ASLEEP]);
    expect(player.active.damage).toEqual(0);
    expect(opponent.active.damage).toEqual(0);
  });

  // Hypnotic Ray (20) - The Defending Pokémon is now Asleep.
  it('Should use Hypnotic Ray attack', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);
    TestUtils.setFlipResults(sim, [false]); // so the opponent remains asleep

    // attack
    sim.dispatch(new AttackAction(1, 'Hypnotic Ray'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.ASLEEP]);
  });

});
