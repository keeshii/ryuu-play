import {
  AttackAction,
  CardType,
  CheckRetreatCostEffect,
  Simulator,
  SpecialCondition,
} from '@ptcg/common';
import { Voltorb } from '../../../src/ex-sets/set-firered-and-leafgreen/voltorb';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestUtils } from '../../test-utils';

describe('Voltorb RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Voltorb()],
      [CardType.LIGHTNING, CardType.COLORLESS]
    );
  });

  it('Should make retreat cost 0 when Voltorb has energy attached', () => {
    const { player } = TestUtils.getAll(sim);
    const effect = new CheckRetreatCostEffect(player);

    sim.store.reduceEffect(sim.store.state, effect);

    expect(effect.cost).toEqual([]);
  });

  it('Should keep retreat cost when Voltorb has no energy attached', () => {
    const { player } = TestUtils.getAll(sim);

    TestUtils.setActive(
      sim,
      [new Voltorb()],
      []
    );

    const effect = new CheckRetreatCostEffect(player);
    sim.store.reduceEffect(sim.store.state, effect);

    expect(effect.cost).toEqual([CardType.COLORLESS]);
  });

  it('Should keep retreat cost when Voltorb has evolved', () => {
    const { player } = TestUtils.getAll(sim);
    const evolution = new TestPokemon();
    evolution.retreat = [CardType.COLORLESS];
    player.active.pokemons.cards.push(evolution);

    const effect = new CheckRetreatCostEffect(player);
    sim.store.reduceEffect(sim.store.state, effect);

    expect(effect.cost).toEqual([CardType.COLORLESS]);
  });

  it('Should not make retreat cost 0 when Floating Electrons is blocked', () => {
    const { player } = TestUtils.getAll(sim);

    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);
    const effect = new CheckRetreatCostEffect(player);

    sim.store.reduceEffect(sim.store.state, effect);

    expect(effect.cost).toEqual([CardType.COLORLESS]);
  });

  it('Should use Thundershock attack and paralyze on heads', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Thundershock'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.PARALYZED]);
  });

  it('Should use Thundershock attack and not paralyze on tails', () => {
    const { opponent } = TestUtils.getAll(sim);

    TestUtils.setFlipResults(sim, [false]);
    sim.dispatch(new AttackAction(1, 'Thundershock'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
    expect(opponent.active.specialConditions).toEqual([]);
  });
});
