import {
    Attack,
  AttackAction,
  AttackEffect,
  CardType,
  Effect,
  PassTurnAction,
  PutCountersEffect,
  Simulator,
  SpecialCondition,
  State,
  StoreLike,
} from '@ptcg/common';
import { Venomoth } from '../../../src/ex-sets/set-firered-and-leafgreen/venomoth';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestUtils } from '../../test-utils';

class TestPokemonPutCountersEffect extends TestPokemon {
  public attacks: Attack[] = [
    {
      name: 'Test attack',
      cost: [],
      damage: '',
      text: ''
    },
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect) {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const putCounters = new PutCountersEffect(effect, 10);
      store.reduceEffect(state, putCounters);
    }
    return state;
  };
}


describe('Venomoth RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Venomoth()],
      [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS]
    );
  });

  it('Should prevent all effect of an attack done to Venomoth', () => {
    const { player } = TestUtils.getAll(sim);
    TestUtils.setDefending(sim, [new TestPokemonPutCountersEffect()]);
    
    sim.dispatch(new PassTurnAction(1));

    sim.dispatch(new AttackAction(2, 'Test attack'));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(0);
  });

  it('Should not prevent damage done to Venomoth', () => {
    const { player } = TestUtils.getAll(sim);
    TestUtils.setDefending(sim, [new TestPokemon()]);
    
    sim.dispatch(new PassTurnAction(1));

    sim.dispatch(new AttackAction(2, 'Test attack'));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(10);
  });

  it('Should not prevent effects of an attack when powers are blocked', () => {
    const { player } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);
    TestUtils.setDefending(sim, [new TestPokemonPutCountersEffect()]);
    
    sim.dispatch(new PassTurnAction(1));

    sim.dispatch(new AttackAction(2, 'Test attack'));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(10);
  });

  it('Should not prevent effects of an attack when Venomoth has evolved', () => {
    const { player } = TestUtils.getAll(sim);
    player.active.pokemons.cards.push(new TestPokemon());
    TestUtils.setDefending(sim, [new TestPokemonPutCountersEffect()]);

    sim.dispatch(new PassTurnAction(1));

    sim.dispatch(new AttackAction(2, 'Test attack'));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(10);
  });

  it('Should use Sleep Poison and poison the Defending Pokémon', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false]);

    sim.dispatch(new AttackAction(1, 'Sleep Poison'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
    expect(opponent.active.specialConditions).toContain(SpecialCondition.ASLEEP);
    expect(opponent.active.specialConditions).toContain(SpecialCondition.POISONED);
  });

  it('Should use Razor Wind and do 60 damage on heads', () => {
    const { opponent } = TestUtils.getAll(sim);

    TestUtils.setFlipResults(sim, [true]);
    sim.dispatch(new AttackAction(1, 'Razor Wind'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(60);
  });

  it('Should use Razor Wind and do nothing on tails', () => {
    const { opponent } = TestUtils.getAll(sim);

    TestUtils.setFlipResults(sim, [false]);
    sim.dispatch(new AttackAction(1, 'Razor Wind'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
  });
});
