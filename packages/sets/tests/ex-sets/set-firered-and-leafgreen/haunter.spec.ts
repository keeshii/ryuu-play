import {
  AttackAction,
  CardType,
  GameMessage,
  Simulator,
  SpecialCondition,
  UseAbilityAction,
} from '@ptcg/common';

import { Haunter } from '../../../src/ex-sets/set-firered-and-leafgreen/haunter';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from "../../test-utils";

describe('Haunter RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Haunter()],
      [CardType.PSYCHIC, CardType.COLORLESS],
    );
  });

  // Head Trip - Once during your turn (before your attack), if Haunter is on your Bench, you may use this power.
  // One of your Active Pokémon is now Confused.
  it('Should use Head Trip ability', () => {
    const { player } = TestUtils.getAll(sim);
    player.active = TestUtils.pokemonSlot([new TestPokemon()]);
    player.bench[0] = TestUtils.pokemonSlot([new Haunter()]);
    const target = TestUtils.target(sim, player.bench[0]);

    // ability
    sim.dispatch(new UseAbilityAction(1, 'Head Trip' , target));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.specialConditions).toEqual([SpecialCondition.CONFUSED]);
  });

  it('Should use Head Trip ability - already used', () => {
    const { player } = TestUtils.getAll(sim);
    player.active = TestUtils.pokemonSlot([new TestPokemon()]);
    player.bench[0] = TestUtils.pokemonSlot([new Haunter()]);
    const target = TestUtils.target(sim, player.bench[0]);

    // ability
    sim.dispatch(new UseAbilityAction(1, 'Head Trip' , target));
    
    let message = ''
    try {
      // ability, again
      sim.dispatch(new UseAbilityAction(1, 'Head Trip' , target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.POWER_ALREADY_USED);
  });

  it('Should use Head Trip ability - active', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim, player.active);

    let message = ''
    try {
      // ability
      sim.dispatch(new UseAbilityAction(1, 'Head Trip' , target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_USE_POWER);
  });

  // Confuse Ray (20) - Flip a coin. If heads, the Defending Pokémon is now Confused.
  it('Should use Confuse Ray attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Confuse Ray'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.CONFUSED]);
  });

  it('Should use Confuse Ray attack - tails', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false]);

    // attack
    sim.dispatch(new AttackAction(1, 'Confuse Ray'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
    expect(opponent.active.specialConditions).toEqual([]);
  });

});
