import {
  AttackAction,
  CardType,
  GameMessage,
  ResolvePromptAction,
  Simulator,
  UseAbilityAction,
} from '@ptcg/common';

import { Eelektrik } from '../../../src/standard/set-black-and-white/eelektrik';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Eelektrik NV', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [ new Eelektrik() ],
      [ CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS ]
    );  });

  it('Should use Dynamotor ability to attach Lightning Energy from discard to bench', () => {
    const { player, prompts } = TestUtils.getAll(sim);

    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    player.discard.cards = TestUtils.makeEnergies([CardType.LIGHTNING]);

    sim.dispatch(new UseAbilityAction(1, 'Dynamotor', TestUtils.target(sim, player.active)));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Attach energy',
      playerId: 1,
      message: GameMessage.ATTACH_ENERGY_TO_BENCH,
      options: jasmine.objectContaining({ allowCancel: true, min: 1, max: 1 })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, [
      { card: player.discard.cards[0], to: TestUtils.target(sim, player.bench[0]) }
    ]));

    expect(player.bench[0].energies.cards).toEqual(TestUtils.makeEnergies([CardType.LIGHTNING]));
    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
  });

  it('Should cancel Dynamotor ability without attaching energy', () => {
    const { player, prompts } = TestUtils.getAll(sim);

    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    player.discard.cards = TestUtils.makeEnergies([CardType.LIGHTNING]);

    sim.dispatch(new UseAbilityAction(1, 'Dynamotor', TestUtils.target(sim, player.active)));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Attach energy',
      playerId: 1,
      message: GameMessage.ATTACH_ENERGY_TO_BENCH,
      options: jasmine.objectContaining({ allowCancel: true, min: 1, max: 1 })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(player.bench[0].energies.cards).toEqual([]);
    expect(player.discard.cards).toEqual(TestUtils.makeEnergies([CardType.LIGHTNING]));
    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
  });

  it('Should not allow Dynamotor when no Lightning Energy in discard', () => {
    const { player } = TestUtils.getAll(sim);

    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    player.discard.cards = [];

    let message = '';
    try {
    sim.dispatch(new UseAbilityAction(1, 'Dynamotor', TestUtils.target(sim, player.active)));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_USE_POWER);
  });

  it('Should not allow Dynamotor when no Pokemon on bench', () => {
    const { player } = TestUtils.getAll(sim);

    player.discard.cards = TestUtils.makeEnergies([CardType.LIGHTNING]);

    let message = '';
    try {
    sim.dispatch(new UseAbilityAction(1, 'Dynamotor', TestUtils.target(sim, player.active)));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_USE_POWER);
  });

  it('Should not allow Dynamotor when already used', () => {
    const { player, prompts } = TestUtils.getAll(sim);

    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    player.discard.cards = TestUtils.makeEnergies([CardType.LIGHTNING, CardType.LIGHTNING]);

    sim.dispatch(new UseAbilityAction(1, 'Dynamotor', TestUtils.target(sim, player.active)));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Attach energy',
      playerId: 1,
      message: GameMessage.ATTACH_ENERGY_TO_BENCH,
      options: jasmine.objectContaining({ allowCancel: true, min: 1, max: 1 })
    }));
    sim.dispatch(new ResolvePromptAction(prompts[0].id, [
      { card: player.discard.cards[0], to: TestUtils.target(sim, player.bench[0]) }
    ]));

    let message = '';
    try {
      sim.dispatch(new UseAbilityAction(1, 'Dynamotor', TestUtils.target(sim, player.active)));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.POWER_ALREADY_USED);
  });

  it('Should use Electric Ball', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Electric Ball'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(50);
  });

});
