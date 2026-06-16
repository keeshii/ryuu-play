import {
  AttackAction,
  CardType,
  ChooseCardsPrompt,
  GameMessage,
  ResolvePromptAction,
  Simulator,
  SpecialCondition,
  SuperType
} from '@ptcg/common';
import { Venonat } from '../../../src/ex-sets/set-firered-and-leafgreen/venonat';
import { TestPokemonIgnoreAttackCost } from '../../test-cards/test-pokemon-ignore-attack-cost';
import { TestUtils } from '../../test-utils';

describe('Venonat RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Venonat()],
      [CardType.GRASS]
    );
  });

  it('Should use Psycho Waves and prompt to discard an Energy attached to Venonat', () => {
    const { player, opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Psycho Waves'));

    const prompt = TestUtils.lastPrompt(sim) as ChooseCardsPrompt;
    expect(prompt).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      cards: player.active.energies,
      filter: { superType: SuperType.ENERGY },
      options: jasmine.objectContaining({ min: 1, max: 1, allowCancel: false })
    }));

    sim.dispatch(new ResolvePromptAction(prompt.id, [player.active.energies.cards[0]]));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.energies.cards.length).toEqual(0);
    expect(player.active.specialConditions).toEqual([]);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.CONFUSED]);
  });

  it('Should use Psycho Waves and cancel prompt', () => {
    const { player, opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Psycho Waves'));

    const prompt = TestUtils.lastPrompt(sim) as ChooseCardsPrompt;
    expect(prompt).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      cards: player.active.energies,
      filter: { superType: SuperType.ENERGY },
      options: jasmine.objectContaining({ min: 1, max: 1, allowCancel: false })
    }));

    sim.dispatch(new ResolvePromptAction(prompt.id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.energies.cards.length).toEqual(1);
    expect(player.active.specialConditions).toEqual([]);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.CONFUSED]);
  });

  it('Should use Psycho Waves with no energies attached', () => {
    const { player, opponent } = TestUtils.getAll(sim);
    player.active.energies.cards = [];
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonIgnoreAttackCost()]);

    sim.dispatch(new AttackAction(1, 'Psycho Waves'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.energies.cards).toEqual([]);
    expect(player.active.specialConditions).toEqual([]);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.CONFUSED]);
  });

  it('Should use Bite for 10 damage', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Bite'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });
});
