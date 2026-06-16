import {
  AttackAction,
  CardTag,
  CardType,
  GameMessage,
  PassTurnAction,
  RetreatAction,
  Simulator,
  SpecialCondition,
} from '@ptcg/common';

import { Poliwrath } from '../../../src/ex-sets/set-firered-and-leafgreen/poliwrath';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestUtils } from '../../test-utils';

describe('Poliwrath RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Poliwrath()],
      [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  it('Should use Split Spiral Punch and confuse the Defending Pokémon', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Split Spiral Punch'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.CONFUSED]);
  });

  it('Should use Mega Throw and do 50 damage to non-EX', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Mega Throw'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(50);
  });

  it('Should use Mega Throw and do 80 damage to Pokémon-ex', () => {
    const { opponent } = TestUtils.getAll(sim);
    opponent.active.pokemons.cards[0].tags = [CardTag.POKEMON_EX];

    sim.dispatch(new AttackAction(1, 'Mega Throw'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(80);
  });

  it('Should block retreat for opponent Confused Active Pokémon', () => {
    const { opponent } = TestUtils.getAll(sim);
    opponent.active.specialConditions.push(SpecialCondition.CONFUSED);

    sim.dispatch(new PassTurnAction(1));

    let message = '';
    try {
      sim.dispatch(new RetreatAction(2, 0));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(message).toEqual(GameMessage.BLOCKED_BY_ABILITY);
  });

  it('Should allow retreat when opponent is not Confused', () => {
    const { opponent } = TestUtils.getAll(sim);
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    
    sim.dispatch(new PassTurnAction(1));

    sim.dispatch(new RetreatAction(2, 0));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active).toEqual(TestUtils.pokemonSlot([new TestPokemon()]));
  });

  it('Should allow retreat when power is blocked', () => {
    const { opponent } = TestUtils.getAll(sim);
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);
    opponent.active.specialConditions.push(SpecialCondition.CONFUSED);

    sim.dispatch(new PassTurnAction(1));

    sim.dispatch(new RetreatAction(2, 0));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active).toEqual(TestUtils.pokemonSlot([new TestPokemonBlockPowers()]));
  });


  it('Should allow retreat when Poliwrath is on Bench', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.active = TestUtils.pokemonSlot([new TestPokemon()]);
    player.bench[0] = TestUtils.pokemonSlot([new Poliwrath()]);
    opponent.active.specialConditions.push(SpecialCondition.CONFUSED);
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    sim.dispatch(new PassTurnAction(1));

    sim.dispatch(new RetreatAction(2, 0));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active).toEqual(TestUtils.pokemonSlot([new TestPokemon()]));
  });
});
