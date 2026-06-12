import {
  AttackAction,
  CardType,
  CardTransfer,
  GameMessage,
  PlayCardAction,
  ResolvePromptAction,
  Simulator,
  SpecialCondition
} from '@ptcg/common';
import { MoltresEx } from '../../../src/ex-sets/set-firered-and-leafgreen/moltres-ex';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestPokemonIgnoreAttackCost } from '../../test-cards/test-pokemon-ignore-attack-cost';
import { TestUtils } from '../../test-utils';

describe('Moltres ex RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('Should use Legendary Ascent - canceled', () => {
    const { bench, player, prompts } = TestUtils.getAll(sim);
    const moltres = new MoltresEx();
    const benchTarget = TestUtils.target(sim, bench[1]);

    TestUtils.setActive(sim, [new TestPokemon()], [CardType.FIRE, CardType.FIRE]);
    player.hand.cards = [moltres];

    sim.dispatch(new PlayCardAction(1, player.hand.cards.indexOf(moltres), benchTarget));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Confirm',
      playerId: player.id,
      message: GameMessage.WANT_TO_USE_ABILITY
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot(
      [new TestPokemon()],
      [CardType.FIRE, CardType.FIRE]
    ));
    expect(bench[1]).toEqual(TestUtils.pokemonSlot([moltres]));
  });

  it('Should use Legendary Ascent - switch and move energies', () => {
    const { bench, player, prompts } = TestUtils.getAll(sim);
    const moltres = new MoltresEx();
    const benchTarget = TestUtils.target(sim, bench[1]);

    TestUtils.setActive(sim, [new TestPokemon()], [CardType.FIRE, CardType.FIRE]);
    bench[0] = TestUtils.pokemonSlot([new TestPokemon()], [CardType.FIRE]);
    player.hand.cards = [moltres];

    sim.dispatch(new PlayCardAction(1, player.hand.cards.indexOf(moltres), benchTarget));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Confirm',
      playerId: player.id,
      message: GameMessage.WANT_TO_USE_ABILITY
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, true));

    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Move energy',
      playerId: player.id,
      message: GameMessage.MOVE_ENERGY_TO_ACTIVE
    }));

    const selected: CardTransfer[] = [{
      from: TestUtils.target(sim, bench[0]),
      to: TestUtils.target(sim, player.active),
      card: bench[0].energies.cards[0]
    }];

    sim.dispatch(new ResolvePromptAction(prompts[1].id, selected));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot([moltres], [CardType.FIRE]));
    expect(bench[0]).toEqual(TestUtils.pokemonSlot([new TestPokemon()]));
    expect(bench[1]).toEqual(TestUtils.pokemonSlot(
      [new TestPokemon()],
      [CardType.FIRE, CardType.FIRE]
    ));
  });

  it('Should use Legendary Ascent - blocked', () => {
    const { bench, player, prompts } = TestUtils.getAll(sim);
    const moltres = new MoltresEx();
    const benchTarget = TestUtils.target(sim, bench[1]);

    TestUtils.setActive(sim, [new TestPokemonBlockPowers()], [CardType.FIRE, CardType.FIRE]);
    player.hand.cards = [moltres];

    sim.dispatch(new PlayCardAction(1, player.hand.cards.indexOf(moltres), benchTarget));

    expect(prompts.length).toEqual(0);
    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot(
      [new TestPokemonBlockPowers()],
      [CardType.FIRE, CardType.FIRE]
    ));
    expect(bench[1]).toEqual(TestUtils.pokemonSlot([moltres]));
  });

  it('Should use Crushing Flames and discard energy to confuse', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    TestUtils.setActive(sim, [new MoltresEx()], [CardType.FIRE, CardType.FIRE, CardType.COLORLESS]);

    sim.dispatch(new AttackAction(1, 'Crushing Flames'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      cards: player.active.energies,
      options: jasmine.objectContaining({ min: 1, max: 1, allowCancel: true })
    }));

    const selected = [player.active.energies.cards[0]];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, selected));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(60);
    expect(player.active.energies.cards.length).toEqual(2);
    expect(player.discard.cards.length).toEqual(1);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.CONFUSED]);
  });

  it('Should use Crushing Flames without discarding energy', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    TestUtils.setActive(sim, [new MoltresEx()], [CardType.FIRE, CardType.FIRE, CardType.COLORLESS]);

    sim.dispatch(new AttackAction(1, 'Crushing Flames'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      cards: player.active.energies,
      options: jasmine.objectContaining({ min: 1, max: 1, allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(60);
    expect(player.active.energies.cards.length).toEqual(3);
    expect(player.discard.cards.length).toEqual(0);
    expect(opponent.active.specialConditions).toEqual([]);
  });

  it('Should use Crushing Flames without energies', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    TestUtils.setActive(sim, [new MoltresEx()], []);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonIgnoreAttackCost()]);

    sim.dispatch(new AttackAction(1, 'Crushing Flames'));

    expect(prompts.length).toEqual(0);
    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(60);
    expect(player.active.energies.cards.length).toEqual(0);
    expect(player.discard.cards.length).toEqual(0);
    expect(opponent.active.specialConditions).toEqual([]);
  });
});
