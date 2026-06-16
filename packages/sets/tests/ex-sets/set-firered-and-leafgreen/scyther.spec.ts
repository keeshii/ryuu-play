import {
  AttackAction,
  CardType,
  CheckRetreatCostEffect,
  Simulator,
} from '@ptcg/common';
import { Scyther } from '../../../src/ex-sets/set-firered-and-leafgreen/scyther';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestUtils } from '../../test-utils';

describe('Scyther RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Scyther()],
      [CardType.GRASS, CardType.COLORLESS]
    );
  });

  it('Should make retreat cost 0 when Scyther has energy attached', () => {
    const { player } = TestUtils.getAll(sim);
    const effect = new CheckRetreatCostEffect(player);

    sim.store.reduceEffect(sim.store.state, effect);

    expect(effect.cost).toEqual([]);
  });

  it('Should keep retreat cost when Scyther has no energy attached', () => {
    const { player } = TestUtils.getAll(sim);

    TestUtils.setActive(
      sim,
      [new Scyther()],
      []
    );

    const effect = new CheckRetreatCostEffect(player);
    sim.store.reduceEffect(sim.store.state, effect);

    expect(effect.cost).toEqual([CardType.COLORLESS]);
  });

  it('Should not make retreat cost 0 when Leaf Ride is blocked', () => {
    const { player } = TestUtils.getAll(sim);

    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);
    const effect = new CheckRetreatCostEffect(player);

    sim.store.reduceEffect(sim.store.state, effect);

    expect(effect.cost).toEqual([CardType.COLORLESS]);
  });

  it('Should not make retreat cost 0 when Scyther has evolved', () => {
    const { player } = TestUtils.getAll(sim);
    const testPokemon = new TestPokemon();
    testPokemon.retreat = [ CardType.COLORLESS ];
    player.active.pokemons.cards.push(testPokemon);

    const effect = new CheckRetreatCostEffect(player);

    sim.store.reduceEffect(sim.store.state, effect);

    expect(effect.cost).toEqual([CardType.COLORLESS]);
  });

  it('Should use Fury Cutter and do 10 damage when all flips are tails', () => {
    const { opponent } = TestUtils.getAll(sim);

    TestUtils.setFlipResults(sim, [false, false, false]);
    sim.dispatch(new AttackAction(1, 'Fury Cutter'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

  it('Should use Fury Cutter and do 50 damage when all flips are heads', () => {
    const { opponent } = TestUtils.getAll(sim);

    TestUtils.setFlipResults(sim, [true, true, true]);
    sim.dispatch(new AttackAction(1, 'Fury Cutter'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(50);
  });
});
