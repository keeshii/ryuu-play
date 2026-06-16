import {
  AttackAction,
  CardType,
  EnergyType,
  GameMessage,
  ResolvePromptAction,
  Simulator,
  SlotType,
  SuperType,
} from '@ptcg/common';

import { Pikachu } from '../../../src/ex-sets/set-firered-and-leafgreen/pikachu';
import { TestEnergy } from '../../test-cards/test-energy';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Pikachu RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Pikachu()],
      [CardType.COLORLESS],
    );
  });

  it('Should use Plasma and attach Lightning Energy from discard on heads', () => {
    const { player, opponent, prompts } = TestUtils.getAll(sim);
    const lightningEnergy = new TestEnergy(CardType.LIGHTNING);
    player.discard.cards = [lightningEnergy];

    sim.dispatch(new AttackAction(1, 'Plasma'));

    expect(prompts.length).toEqual(2);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Coin flip',
      playerId: player.id,
      message: GameMessage.COIN_FLIP,
    }));
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Attach energy',
      playerId: player.id,
      message: GameMessage.ATTACH_ENERGY_TO_BENCH,
      slots: [SlotType.ACTIVE],
      cardList: player.discard,
      filter: jasmine.objectContaining({
        superType: SuperType.ENERGY,
        energyType: EnergyType.BASIC,
      }),
      options: jasmine.objectContaining({ min: 1, max: 1 })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[1].id, [
      { card: lightningEnergy, to: TestUtils.target(sim, player.active) }
    ]));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.energies.cards).toEqual(TestUtils.makeEnergies([CardType.COLORLESS, CardType.LIGHTNING]));
    expect(player.discard.cards).toEqual([]);
  });

  it('Should use Plasma and cancel prompt', () => {
    const { player, opponent, prompts } = TestUtils.getAll(sim);
    const lightningEnergy = new TestEnergy(CardType.LIGHTNING);
    player.discard.cards = [lightningEnergy];

    sim.dispatch(new AttackAction(1, 'Plasma'));

    expect(prompts.length).toEqual(2);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Coin flip',
      playerId: player.id,
      message: GameMessage.COIN_FLIP,
    }));
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Attach energy',
      playerId: player.id,
      message: GameMessage.ATTACH_ENERGY_TO_BENCH,
      slots: [SlotType.ACTIVE],
      cardList: player.discard,
      filter: jasmine.objectContaining({
        superType: SuperType.ENERGY,
        energyType: EnergyType.BASIC,
      }),
      options: jasmine.objectContaining({ min: 1, max: 1 })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[1].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.energies.cards).toEqual(TestUtils.makeEnergies([CardType.COLORLESS]));
    expect(player.discard.cards).toEqual(TestUtils.makeEnergies([CardType.LIGHTNING]));
  });

  it('Should use Plasma and do nothing on tails', () => {
    const { player, opponent } = TestUtils.getAll(sim);
    player.discard.cards = [new TestEnergy(CardType.LIGHTNING)];

    TestUtils.setFlipResults(sim, [false]);
    sim.dispatch(new AttackAction(1, 'Plasma'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.energies.cards).toEqual(TestUtils.makeEnergies([CardType.COLORLESS]));
    expect(player.discard.cards.length).toEqual(1);
  });

  it('Should use Plasma and do nothing when no Lightning Energy in discard', () => {
    const { player, opponent } = TestUtils.getAll(sim);
    player.discard.cards = [new TestPokemon()];

    sim.dispatch(new AttackAction(1, 'Plasma'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.energies.cards).toEqual(TestUtils.makeEnergies([CardType.COLORLESS]));
  });

});
