import {
  AttackAction,
  CardType,
  PassTurnAction,
  Simulator,
  SpecialCondition,
} from '@ptcg/common';

import { Persian } from '../../../src/ex-sets/set-firered-and-leafgreen/persian';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestUtils } from '../../test-utils';

describe('Persian RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Persian()],
      [CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  it('Should use Poison Claws and poison the Defending Pokémon', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Poison Claws'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.POISONED]);
  });

  it('Should use Shining Claws and confuse the Defending Pokémon', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Shining Claws'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.CONFUSED]);
  });

  it('Should use Thick Skin and remove special conditions from Persian between turns', () => {
    const { opponent, player } = TestUtils.getAll(sim);

    player.active.specialConditions.push(SpecialCondition.POISONED);
    player.active.specialConditions.push(SpecialCondition.CONFUSED);
    opponent.active.specialConditions.push(SpecialCondition.POISONED);

    sim.dispatch(new PassTurnAction(1));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.specialConditions).toEqual([]);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.POISONED]);
  });

  it('Should not remove special conditions when Thick Skin is blocked', () => {
    const { opponent, player } = TestUtils.getAll(sim);

    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);
    player.active.specialConditions.push(SpecialCondition.POISONED);

    sim.dispatch(new PassTurnAction(1));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.specialConditions).toEqual([SpecialCondition.POISONED]);
  });
});
