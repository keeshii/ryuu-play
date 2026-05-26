import {
  AttackAction,
  CardType,
  PokemonCard,
  Simulator,
  SpecialCondition
} from '@ptcg/common';

import { Cloyster } from '../../../src/ex-sets/set-firered-and-leafgreen/cloyster';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestUtils } from "../../test-utils";

describe('Cloyster RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Cloyster()],
      [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  // Exoskeleton - Any damage done to Cloyster by attacks is reduced by 20 (after applying Weakness and Resistance).
  it('Should use Exoskeleton ability', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [new TestPokemon()]);
    TestUtils.setDefending(sim, [new Cloyster()]);

    const active = player.active.getPokemonCard() as PokemonCard;
    active.attacks[0].damage = '50';

    // attack
    sim.dispatch(new AttackAction(1, 'Test attack'));

    // ability
    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
  });

  it('Should use Exoskeleton ability - blocked', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [new TestPokemon()]);
    TestUtils.setDefending(sim, [new Cloyster()]);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);

    const active = player.active.getPokemonCard() as PokemonCard;
    active.attacks[0].damage = '50';

    // attack
    sim.dispatch(new AttackAction(1, 'Test attack'));

    // ability
    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(50);
  });

  it('Should use Exoskeleton ability - cloyser has evolved', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [new TestPokemon()]);
    TestUtils.setDefending(sim, [new Cloyster(), new TestPokemon()]);

    const active = player.active.getPokemonCard() as PokemonCard;
    active.attacks[0].damage = '50';

    // attack
    sim.dispatch(new AttackAction(1, 'Test attack'));

    // ability
    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(50);
  });

  // Double Bubble (10×) - Flip 2 coins. This attack does 10 damage times the number of heads. If either of the
  // coins is heads, the Defending Pokémon is now Paralyzed.
  it('Should use Double Bubble attack - 2x heads', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Double Bubble'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.PARALYZED]);
  });

  it('Should use Double Bubble attack - heads, tails', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [true, false]);

    // attack
    sim.dispatch(new AttackAction(1, 'Double Bubble'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.PARALYZED]);
  });

  it('Should use Double Bubble attack - 2x tails', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false, false]);

    // attack
    sim.dispatch(new AttackAction(1, 'Double Bubble'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(opponent.active.specialConditions).toEqual([]);
  });

  // Shell Attack (50)
  it('Should use Shell Attack attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Shell Attack'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(50);
  });

});
