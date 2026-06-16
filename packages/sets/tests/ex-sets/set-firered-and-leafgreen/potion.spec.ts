import {
  GameMessage,
  PlayCardAction,
  ResolvePromptAction,
  Simulator,
  SlotType,
} from '@ptcg/common';

import { Potion } from '../../../src/ex-sets/set-firered-and-leafgreen/potion';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Potion RG', () => {
  let sim: Simulator;
  let trainerCard: Potion;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    trainerCard = new Potion();

    const state = sim.store.state;
    state.players[0].hand.cards = [trainerCard];
  });

  it('Should play Potion and heal 20 damage from active Pokémon', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    player.active.damage = 50;

    sim.dispatch(new PlayCardAction(1, index, target));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_HEAL,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, [player.active]));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(30);
    expect(player.discard.cards).toEqual([trainerCard]);
  });

  it('Should play Potion and heal 20 damage from bench Pokémon', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    player.active.damage = 0;
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()], [], [], 60);

    sim.dispatch(new PlayCardAction(1, index, target));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_HEAL,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, [player.bench[0]]));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.bench[0].damage).toEqual(40);
    expect(player.discard.cards).toEqual([trainerCard]);
  });

  it('Should play Potion and heal only 1 damage when Pokémon has only 1 damage', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    player.active.damage = 1;

    sim.dispatch(new PlayCardAction(1, index, target));

    expect(prompts.length).toEqual(1);

    sim.dispatch(new ResolvePromptAction(prompts[0].id, [player.active]));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(0);
  });

  it('Should play Potion and cancel the prompt', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    player.active.damage = 40;

    sim.dispatch(new PlayCardAction(1, index, target));

    expect(prompts.length).toEqual(1);

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(40);
    expect(player.hand.cards).toEqual([trainerCard]);
    expect(player.discard.cards).toEqual([]);
  });

  it('Should not be able to play Potion when no Pokémon have damage', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    player.active.damage = 0;

    let message = '';
    try {
      sim.dispatch(new PlayCardAction(1, index, target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_PLAY_THIS_CARD);
  });
});
