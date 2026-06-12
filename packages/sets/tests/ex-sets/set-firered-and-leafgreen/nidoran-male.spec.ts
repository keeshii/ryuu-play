import {
  AttackAction,
  CardType,
  GameMessage,
  ResolvePromptAction,
  Simulator,
} from '@ptcg/common';

import { NidoranMale } from '../../../src/ex-sets/set-firered-and-leafgreen/nidoran-male';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Nidoran Male RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new NidoranMale()],
      [CardType.GRASS, CardType.COLORLESS],
    );
  });

  it('Should use Call for Family and search for a Nidoran Female', () => {
    const { player, opponent, prompts } = TestUtils.getAll(sim);
    const nidoranFemale = new NidoranMale();
    nidoranFemale.name = 'Nidoran Female';
    player.deck.cards = [nidoranFemale];

    sim.dispatch(new AttackAction(1, 'Call for Family'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      cards: player.deck,
      options: jasmine.objectContaining({ min: 0, max: 1, allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, [nidoranFemale]));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.bench[0].pokemons.cards).toEqual([nidoranFemale]);
  });

  it('Should use Call for Family and search for a Nidoran Male', () => {
    const { player, opponent, prompts } = TestUtils.getAll(sim);
    const nidoranMale = new NidoranMale();
    player.deck.cards = [nidoranMale];

    sim.dispatch(new AttackAction(1, 'Call for Family'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      cards: player.deck,
      options: jasmine.objectContaining({ min: 0, max: 1, allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, [nidoranMale]));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.bench[0].pokemons.cards).toEqual([nidoranMale]);
  });

  it('Should use Call for Family - cancel prompt', () => {
    const { player, opponent, prompts } = TestUtils.getAll(sim);
    const nidoranMale = new NidoranMale();
    player.deck.cards = [nidoranMale];

    sim.dispatch(new AttackAction(1, 'Call for Family'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      cards: player.deck,
      options: jasmine.objectContaining({ min: 0, max: 1, allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
  });

  it('Should use Call for Family - empty deck', () => {
    const { player, opponent } = TestUtils.getAll(sim);
    player.deck.cards = [];

    sim.dispatch(new AttackAction(1, 'Call for Family'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
  });

  it('Should use Call for Family - full bench', () => {
    const { opponent, bench, player, prompts } = TestUtils.getAll(sim);
    bench.forEach(b => b.pokemons.cards = [new TestPokemon()]);

    sim.dispatch(new AttackAction(1, 'Call for Family'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      cards: player.deck,
      options: jasmine.objectContaining({ min: 0, max: 0, allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
  });

  it('Should use Double Stab - 2 heads', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [true, true]);

    sim.dispatch(new AttackAction(1, 'Double Stab'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
  });

  it('Should use Double Stab - 1 head', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [true, false]);

    sim.dispatch(new AttackAction(1, 'Double Stab'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

  it('Should use Double Stab - 0 heads', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false, false]);

    sim.dispatch(new AttackAction(1, 'Double Stab'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
  });
});
