import {
  AttackAction,
  AttackEffect,
  CardType,
  Effect,
  PlayerType,
  PutDamageEffect,
  Simulator,
  SlotType,
  SpecialCondition,
  State,
  StateUtils,
  StoreLike
} from '@ptcg/common';

import { Kakuna } from '../../../src/ex-sets/set-firered-and-leafgreen/kakuna';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestUtils } from "../../test-utils";

class TestPokemonDamageBench extends TestPokemon {
  public reduceEffect(store: StoreLike, state: State, effect: Effect) {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      effect.damage = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (pokemonSlot, pokemonCard, target) => {
        if (target.slot === SlotType.BENCH) {
          const dealDamage = new PutDamageEffect(effect, 10);
          dealDamage.target = pokemonSlot;
          store.reduceEffect(state, dealDamage);
        }
      });
    }
    return state;
  };
}

describe('Kakuna RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Kakuna()],
      [CardType.COLORLESS],
    );
  });

  // Poison Payback - If Kakuna is your Active Pokémon and is damaged by an opponent's attack (even if Kakuna is
  // Knocked Out), the Attacking Pokémon is now Poisoned.
  it('Should use Poison Payback ability', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    TestUtils.setDefending(sim, [new Kakuna()]);
    TestUtils.setActive(sim, [new TestPokemon()]);

    // ability
    sim.dispatch(new AttackAction(1, 'Test attack'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
    expect(player.active.damage).toEqual(10);
    expect(player.active.specialConditions).toEqual([SpecialCondition.POISONED]);
  });

  it('Should use Poison Payback ability - evolved', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    TestUtils.setDefending(sim, [new Kakuna(), new TestPokemon()]);
    TestUtils.setActive(sim, [new TestPokemon()]);

    // ability
    sim.dispatch(new AttackAction(1, 'Test attack'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
    expect(player.active.damage).toEqual(0);
    expect(player.active.specialConditions).toEqual([]);
  });

  it('Should use Poison Payback ability - blocked', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    TestUtils.setDefending(sim, [new Kakuna()]);
    TestUtils.setActive(sim, [new TestPokemon()]);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);

    // ability
    sim.dispatch(new AttackAction(1, 'Test attack'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
    expect(player.active.damage).toEqual(0);
    expect(player.active.specialConditions).toEqual([]);
  });
  
  it('Should use Poison Payback ability - damage bench', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    opponent.bench[0] = TestUtils.pokemonSlot([new Kakuna()]);
    TestUtils.setActive(sim, [new TestPokemonDamageBench()]);

    // ability
    sim.dispatch(new AttackAction(1, 'Test attack'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.bench[0].damage).toEqual(10);
    expect(player.active.damage).toEqual(0);
    expect(player.active.specialConditions).toEqual([]);
  });

  // Headbutt (10)
  it('Should use Headbutt attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Headbutt'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

});
