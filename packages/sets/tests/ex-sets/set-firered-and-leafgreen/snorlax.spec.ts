import {
  AttackAction,
  CardType,
  PassTurnAction,
  Simulator,
  SpecialCondition,
} from '@ptcg/common';
import { Snorlax } from '../../../src/ex-sets/set-firered-and-leafgreen/snorlax';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestUtils } from '../../test-utils';

describe('Snorlax RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Snorlax()],
      [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS]
    );

    TestUtils.setFlipResults(sim, [false]); // To keep ASLEEP between turns
  });

  it('Should use Collapse and put Snorlax to sleep', () => {
    const { player, opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Collapse'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
    expect(player.active.specialConditions).toEqual([SpecialCondition.ASLEEP]);
  });

  it('Should use Toss and Turn for 60 damage when Snorlax is asleep', () => {
    const { player, opponent } = TestUtils.getAll(sim);
    player.active.specialConditions.push(SpecialCondition.ASLEEP);

    sim.dispatch(new AttackAction(1, 'Toss and Turn'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(60);
  });

  it('Should heal Snorlax with Rest Up between turns when asleep', () => {
    const { player, opponent } = TestUtils.getAll(sim);
    player.active.damage = 40;
    player.active.specialConditions.push(SpecialCondition.ASLEEP);

    sim.dispatch(new PassTurnAction(1));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.damage).toEqual(20);
    expect(player.active.specialConditions).toEqual([SpecialCondition.ASLEEP]);
  });

  it('Should remove only one damage counter with Rest Up when Snorlax has 10 damage', () => {
    const { player, opponent } = TestUtils.getAll(sim);
    player.active.damage = 10;
    player.active.specialConditions.push(SpecialCondition.ASLEEP);

    sim.dispatch(new PassTurnAction(1));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.damage).toEqual(0);
    expect(player.active.specialConditions).toEqual([SpecialCondition.ASLEEP]);
  });

  it('Should not heal with Rest Up when the power is blocked', () => {
    const { player, opponent } = TestUtils.getAll(sim);
    player.active.damage = 40;
    player.active.specialConditions.push(SpecialCondition.ASLEEP);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);

    sim.dispatch(new PassTurnAction(1));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.damage).toEqual(40);
    expect(player.active.specialConditions).toEqual([SpecialCondition.ASLEEP]);
  });
});
