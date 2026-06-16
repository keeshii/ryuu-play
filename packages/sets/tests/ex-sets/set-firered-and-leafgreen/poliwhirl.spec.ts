import {
  AttackAction,
  CardType,
  EnergyType,
  GameMessage,
  ResolvePromptAction,
  Simulator,
  SpecialCondition,
  SuperType,
} from '@ptcg/common';

import { Poliwhirl } from '../../../src/ex-sets/set-firered-and-leafgreen/poliwhirl';
import { TestEnergy } from '../../test-cards/test-energy';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Poliwhirl RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Poliwhirl()],
      [CardType.WATER, CardType.COLORLESS],
    );
  });

  it('Should use Energy Stream and attach a basic Energy from discard', () => {
    const { player, opponent, prompts } = TestUtils.getAll(sim);
    const energy = new TestEnergy(CardType.WATER);
    player.discard.cards = [energy];

    sim.dispatch(new AttackAction(1, 'Energy Stream'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_ATTACH,
      cards: player.discard,
      filter: { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      options: jasmine.objectContaining({ min: 1, max: 1, allowCancel: false })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, [energy]));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.discard.cards).toEqual([]);
    expect(player.active.energies.cards).toEqual(TestUtils.makeEnergies([CardType.WATER, CardType.COLORLESS, CardType.WATER]));
  });

  it('Should use Energy Stream and cancel prompt', () => {
    const { player, opponent, prompts } = TestUtils.getAll(sim);
    const energy = new TestEnergy(CardType.WATER);
    player.discard.cards = [energy];

    sim.dispatch(new AttackAction(1, 'Energy Stream'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_ATTACH,
      cards: player.discard,
      filter: { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      options: jasmine.objectContaining({ min: 1, max: 1, allowCancel: false })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.discard.cards).toEqual([energy]);
    expect(player.active.energies.cards).toEqual(TestUtils.makeEnergies([CardType.WATER, CardType.COLORLESS]));
  });

  it('Should use Energy Stream and do nothing when no basic Energy is in discard', () => {
    const { player, opponent } = TestUtils.getAll(sim);
    player.discard.cards = [new TestPokemon()];

    sim.dispatch(new AttackAction(1, 'Energy Stream'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.discard.cards.length).toEqual(1);
    expect(player.active.energies.cards).toEqual(TestUtils.makeEnergies([CardType.WATER, CardType.COLORLESS]));
  });

  it('Should use Bubble and paralyze on heads', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Bubble'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.PARALYZED]);
  });

  it('Should use Bubble and not paralyze on tails', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false]);

    sim.dispatch(new AttackAction(1, 'Bubble'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
    expect(opponent.active.specialConditions).toEqual([]);
  });
});
