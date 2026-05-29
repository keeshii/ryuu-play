import {
  GameMessage,
  PlayCardAction,
  ResolvePromptAction,
  Simulator, Stage, SuperType, TrainerCard,
} from '@ptcg/common';

import { GreatBall } from '../../../src/ex-sets/set-firered-and-leafgreen/great-ball';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonEx } from '../../test-cards/test-pokemon-ex';
import { TestUtils } from "../../test-utils";

describe('Great Ball RG', () => {
  let sim: Simulator;
  let trainerCard: TrainerCard;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    trainerCard = new GreatBall();

    const state = sim.store.state;
    state.players[0].hand.cards = [trainerCard];
  });

  // Search your deck for a Basic Pokémon (excluding Pokémon-ex) and put it onto your Bench. Shuffle your deck
  // afterward.
  it('Should play Great Ball trainer card', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    const basic = new TestPokemon();
    const pokemonEx = new TestPokemonEx();

    player.deck.cards.push(basic, pokemonEx);

    // play card
    sim.dispatch(new PlayCardAction(1, index, target));

    // Choose card prompt
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      cards: player.deck,
      filter:  { superType: SuperType.POKEMON, stage: Stage.BASIC },
      options: jasmine.objectContaining({
        min: 1,
        max: 1,
        allowCancel: true,
        blocked: [player.deck.cards.indexOf(pokemonEx)]
      })
    }));

    // Choose card
    sim.dispatch(new ResolvePromptAction(prompts[0].id, [basic]));

    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Shuffle deck',
      playerId: player.id
    }));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.deck.cards.indexOf(basic)).toEqual(-1);
    expect(player.bench[0]).toEqual(TestUtils.pokemonSlot([basic]));
  });

  it('Should play Great Ball trainer card - canceled', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    const basic = new TestPokemon();
    const pokemonEx = new TestPokemonEx();

    player.deck.cards.push(basic, pokemonEx);

    // play card
    sim.dispatch(new PlayCardAction(1, index, target));

    // Choose card prompt
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      cards: player.deck,
      filter:  { superType: SuperType.POKEMON, stage: Stage.BASIC },
      options: jasmine.objectContaining({
        min: 1,
        max: 1,
        allowCancel: true,
        blocked: [player.deck.cards.indexOf(pokemonEx)]
      })
    }));

    // Choose card
    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Shuffle deck',
      playerId: player.id
    }));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.bench[0].pokemons.cards).toEqual([]);
  });

  it('Should play Great Ball trainer card - bench full', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    for (const bench of player.bench) {
      bench.pokemons.cards = [new TestPokemon()];
    }

    let message = ''
    try {
      // play card
      sim.dispatch(new PlayCardAction(1, index, target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_PLAY_THIS_CARD);
  });

  it('Should play Great Ball trainer card - no cards in deck', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);
    player.deck.cards = [];

    let message = ''
    try {
      // play card
      sim.dispatch(new PlayCardAction(1, index, target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_PLAY_THIS_CARD);
  });

});
