import {
  GameMessage,
  PlayCardAction,
  Prompt,
  ResolvePromptAction,
  Simulator,
  Stage,
  SuperType,
  TrainerCard,
} from '@ptcg/common';

import { PokeBall } from '../../../src/ex-sets/set-firered-and-leafgreen/poke-ball';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Poke Ball RG', () => {
  let sim: Simulator;
  let trainerCard: TrainerCard;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    trainerCard = new PokeBall();

    const state = sim.store.state;
    state.players[0].hand.cards = [trainerCard];
  });

  it('Should play Poke Ball and add a selected Pokémon to hand', () => {
    const { player, opponent, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);
    const basic = new TestPokemon();
    const evolution = new TestPokemon();
    evolution.stage = Stage.STAGE_1;

    player.deck.cards = [basic, evolution];

    sim.dispatch(new PlayCardAction(1, index, target));

    expect(prompts.length).toEqual(2);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Coin flip',
      playerId: player.id,
      message: GameMessage.COIN_FLIP
    }));
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_HAND,
      cards: player.deck,
      filter: { superType: SuperType.POKEMON },
      options: jasmine.objectContaining({ min: 1, max: 1, allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[1].id, [basic]));

    const nextPrompt = TestUtils.lastPrompt(sim);
    if (nextPrompt && nextPrompt.type === 'Show cards') {
      sim.dispatch(new ResolvePromptAction(nextPrompt.id, true));
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.hand.cards).toEqual([basic]);
    expect(player.deck.cards).toEqual([evolution]);
    expect(opponent).toBeDefined();
  });

  it('Should play Poke Ball and cancel the search prompt', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);
    const basic = new TestPokemon();
    const evolution = new TestPokemon();

    player.deck.cards = [basic, evolution];

    sim.dispatch(new PlayCardAction(1, index, target));

    const prompt = TestUtils.lastPrompt(sim) as Prompt<any>;
    expect(prompt).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_HAND,
      cards: player.deck,
      filter: { superType: SuperType.POKEMON },
      options: jasmine.objectContaining({ min: 1, max: 1, allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompt.id, null));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.deck.cards).toEqual([evolution, basic]);
    expect(player.hand.cards).toEqual([]);
  });

  it('Should play Poke Ball and not search Pokemon when tails', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);
    const basic = new TestPokemon();
    TestUtils.setFlipResults(sim, [false]);

    player.deck.cards = [basic];

    sim.dispatch(new PlayCardAction(1, index, target));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.deck.cards).toEqual([basic]);
    expect(player.hand.cards).toEqual([]);
  });

  it('Should not play Poke Ball when deck is empty', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);
    player.deck.cards = [];

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
