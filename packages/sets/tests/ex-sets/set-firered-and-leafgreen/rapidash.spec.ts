import {
  AttackAction,
  CardType,
  PassTurnAction,
  Simulator,
  SpecialCondition
} from '@ptcg/common';
import { Rapidash } from '../../../src/ex-sets/set-firered-and-leafgreen/rapidash';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestUtils } from '../../test-utils';

describe('Rapidash RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Rapidash()],
      [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS]
    );
  });

  it('Should use Searing Flame attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Searing Flame'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.BURNED]);
  });

  it('Should increase burn damage with Fiery Aura between turns', () => {
    const { player, opponent } = TestUtils.getAll(sim);

    player.active.addSpecialCondition(SpecialCondition.BURNED);
    TestUtils.setFlipResults(sim, [false]);

    sim.dispatch(new PassTurnAction(1));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.damage).toEqual(40);
  });
  
  it('Should not increase burn damage when powers are blocked', () => {
    const { player, opponent } = TestUtils.getAll(sim);
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);

    player.active.addSpecialCondition(SpecialCondition.BURNED);
    TestUtils.setFlipResults(sim, [false]);

    sim.dispatch(new PassTurnAction(1));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.damage).toEqual(20);
  });
});
