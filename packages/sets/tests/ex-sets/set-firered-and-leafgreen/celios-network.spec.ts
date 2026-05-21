import {
  CardTag,
  ChooseCardsPrompt,
  GameMessage,
  PlayCardAction,
  ResolvePromptAction,
  Simulator
} from "@ptcg/common";
import { CeliosNetwork } from "../../../src/ex-sets/set-firered-and-leafgreen/celios-network";
import { TestPokemon } from "../../test-cards/test-pokemon";


import { TestUtils } from "../../test-utils";

describe('Celio\'s Network RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    const state = sim.store.state;

    state.players[0].hand.cards = [
      new CeliosNetwork()
    ];
  });

  it('Should play Celios Network - with empty deck', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    player.deck.cards = [];

    // play card
    const index = player.hand.cards.findIndex(c => c.name === 'Celio\'s Network');

    let message: string = '';
    try {
      sim.dispatch(new PlayCardAction(1, index, target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_PLAY_THIS_CARD);
  });

  it('Should play Celios Network - canceled', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);

    // play card
    const index = player.hand.cards.findIndex(c => c.name === 'Celio\'s Network');
    sim.dispatch(new PlayCardAction(1, index, target));

    // choose card from deck
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_HAND,
      cards: player.deck
    }));

    // Cancel prompt
    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    // Supported card played, hand empty
    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.hand.cards).toEqual([]);
    expect(player.supporter.cards).toEqual([new CeliosNetwork()]);
  });

  it('Should play Celios Network - card selected', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const testPokemon = new TestPokemon();
    const testPokemonEx = new TestPokemon();
    testPokemonEx.tags = [CardTag.POKEMON_EX];

    player.deck.cards.push(testPokemon, testPokemonEx);

    // play card
    const index = player.hand.cards.findIndex(c => c.name === 'Celio\'s Network');
    sim.dispatch(new PlayCardAction(1, index, target));

    // choose card from deck
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_HAND,
      cards: player.deck
    }));
    const options = (prompts[0] as ChooseCardsPrompt).options;
    expect(options.blocked).toEqual([player.deck.cards.indexOf(testPokemonEx)]);

    // Select card
    sim.dispatch(new ResolvePromptAction(prompts[0].id, [testPokemon]));

    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Show cards',
      playerId: opponent.id,
      message: GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards: [testPokemon]
    }));

    // Confirm show cards
    sim.dispatch(new ResolvePromptAction(prompts[1].id, true));

    // selected card in the hand
    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.hand.cards).toEqual([testPokemon]);
    expect(player.supporter.cards).toEqual([new CeliosNetwork()]);
  });

});
