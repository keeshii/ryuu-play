import {
  AttackAction,
  CardType,
  GameMessage,
  RetreatAction,
  Simulator
} from '@ptcg/common';

import { Dodrio } from '../../../src/ex-sets/set-firered-and-leafgreen/dodrio';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestPokemonEx } from '../../test-cards/test-pokemon-ex';
import { TestUtils } from "../../test-utils";

describe('Dodrio RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    const state = sim.store.state;

    state.turn = 1;

   TestUtils.setActive(
      sim,
      [new Dodrio()],
      [CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  // Retreat Aid - As long as Dodrio is on your Bench, you pay C C less to retreat your Active
  // Pokémon (excluding Pokémon-ex and Baby Pokémon.)
  it('Should use Retreat Aid ability', () => {
    const { player } = TestUtils.getAll(sim);
    const testPokemon = new TestPokemon();
    testPokemon.retreat = [ CardType.COLORLESS, CardType.COLORLESS ];
    player.bench[0] = player.active;
    player.active = TestUtils.pokemonSlot([testPokemon]);

    // retreat
    sim.dispatch(new RetreatAction(1, 0));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot(
      [new Dodrio()],
      [CardType.COLORLESS, CardType.COLORLESS]
    ));
    expect(player.bench[0]).toEqual(TestUtils.pokemonSlot([testPokemon]));
  });

  it('Should use Retreat Aid ability - not work for Pokemon Ex', () => {
    const { player } = TestUtils.getAll(sim);
    const testPokemonEx = new TestPokemonEx();
    testPokemonEx.retreat = [ CardType.COLORLESS, CardType.COLORLESS ];
    player.bench[0] = player.active;
    player.active = TestUtils.pokemonSlot([testPokemonEx]);

    let message = ''
    try {
      // retreat
      sim.dispatch(new RetreatAction(1, 0));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.NOT_ENOUGH_ENERGY);

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot([testPokemonEx]));
    expect(player.bench[0]).toEqual(TestUtils.pokemonSlot(
      [new Dodrio()],
      [CardType.COLORLESS, CardType.COLORLESS]
    ));
  });

  it('Should use Retreat Aid ability - not work when Dodrio on bench', () => {
    const { player } = TestUtils.getAll(sim);
    player.active.energies.cards = [];
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    let message = ''
    try {
      // retreat
      sim.dispatch(new RetreatAction(1, 0));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.NOT_ENOUGH_ENERGY);

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot([new Dodrio()]));
    expect(player.bench[0]).toEqual(TestUtils.pokemonSlot([new TestPokemon()]));
  });

  it('Should use Retreat Aid ability - blocked', () => {
    const { player } = TestUtils.getAll(sim);
    const testPokemon = new TestPokemonBlockPowers();
    testPokemon.retreat = [ CardType.COLORLESS, CardType.COLORLESS ];
    player.bench[0] = player.active;
    player.active = TestUtils.pokemonSlot([testPokemon]);

    let message = ''
    try {
      // retreat
      sim.dispatch(new RetreatAction(1, 0));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.NOT_ENOUGH_ENERGY);

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot([testPokemon]));
    expect(player.bench[0]).toEqual(TestUtils.pokemonSlot(
      [new Dodrio()],
      [CardType.COLORLESS, CardType.COLORLESS]
    ));
  });

  // Tri Attack (20×) - Flip 3 coins. This attack does 20 damage times the number of heads.
  it('Should use Tri Attack attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Tri Attack'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(60);
  });

});
