import {
  AttackAction,
  CardType,
  CheckRetreatCostEffect,
  RetreatAction,
  Simulator,
  SpecialCondition
} from '@ptcg/common';

import { Nidoqueen } from '../../../src/ex-sets/set-firered-and-leafgreen/nidoqueen';
import { NidoranFemale } from '../../../src/ex-sets/set-firered-and-leafgreen/nidoran-female';
import { Nidorino } from '../../../src/ex-sets/set-firered-and-leafgreen/nidorino';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestUtils } from '../../test-utils';

describe('Nidoqueen RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Nidoqueen()],
      [CardType.FIGHTING, CardType.GRASS, CardType.COLORLESS],
    );
  });

  it('Should make Nidoran Female retreat for free while Nidoqueen is in play', () => {
    const { player } = TestUtils.getAll(sim);

    sim.store.state.turn = 1;
    player.retreatedTurn = 0;
    player.active = TestUtils.pokemonSlot([new NidoranFemale()]);
    player.bench[0] = TestUtils.pokemonSlot([new Nidoqueen()]);

    sim.dispatch(new RetreatAction(1, 0));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot([new Nidoqueen()]));
    expect(player.bench[0]).toEqual(TestUtils.pokemonSlot([new NidoranFemale()]));
  });

  it('Should keep Nidoqueen retreat cost at C C', () => {
    const { player } = TestUtils.getAll(sim);
    const effect = new CheckRetreatCostEffect(player);

    sim.store.reduceEffect(sim.store.state, effect);

    expect(effect.cost).toEqual([CardType.COLORLESS, CardType.COLORLESS]);
  });

  it('Should not make Nidoran Female retreat for free when the ability is blocked', () => {
    const { player } = TestUtils.getAll(sim);

    player.active = TestUtils.pokemonSlot([new NidoranFemale()]);
    player.bench[0] = TestUtils.pokemonSlot([new Nidoqueen()]);
    player.bench[1] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);

    const effect = new CheckRetreatCostEffect(player);
    sim.store.reduceEffect(sim.store.state, effect);

    expect(effect.cost).toEqual([CardType.COLORLESS]);
  });

  it('Should not make Nidoran Female retreat for free when Nidoqueen is on the opponent bench', () => {
    const { player, opponent } = TestUtils.getAll(sim);

    player.active = TestUtils.pokemonSlot([new NidoranFemale()]);
    opponent.bench[0] = TestUtils.pokemonSlot([new Nidoqueen()]);

    const effect = new CheckRetreatCostEffect(player);
    sim.store.reduceEffect(sim.store.state, effect);

    expect(effect.cost).toEqual([CardType.COLORLESS]);
  });

  it('Should use Toxic and put 2 damage counters for poison', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Toxic'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.POISONED]);
    expect(opponent.active.poisonDamage).toEqual(20);
  });

  it('Should use Power Lariat and add 10 damage for each evolved Pokémon in play', () => {
    const { opponent, player } = TestUtils.getAll(sim);

    player.bench[0] = TestUtils.pokemonSlot([new Nidorino()]);

    sim.dispatch(new AttackAction(1, 'Power Lariat'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(60);
  });
});
