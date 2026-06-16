import {
  GameMessage,
  PlayCardAction,
  ResolvePromptAction,
  Simulator,
  PlayerType,
  SlotType,
  TrainerCard,
} from '@ptcg/common';

import { PokemonReversal } from '../../../src/ex-sets/set-firered-and-leafgreen/pokemon-reversal';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Pokemon Reversal RG', () => {
  let sim: Simulator;
  let trainerCard: TrainerCard;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    trainerCard = new PokemonReversal();

    const state = sim.store.state;
    state.players[0].hand.cards = [trainerCard];
  });

  it('Should play Pokemon Reversal and do nothing on tails', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);
    TestUtils.setFlipResults(sim, [false]);

    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    sim.dispatch(new PlayCardAction(1, index, target));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.hand.cards).toEqual([]);
    expect(player.discard.cards).toEqual([trainerCard]);
  });

  it('Should play Pokemon Reversal and prompt to switch opponent bench Pokémon on heads', () => {
    const { player, opponent, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    const benchSlot = opponent.bench[0];

    TestUtils.setFlipResults(sim, [true]);
    sim.dispatch(new PlayCardAction(1, index, target));

    expect(prompts.length).toEqual(2);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Coin flip',
      playerId: player.id,
      message: GameMessage.COIN_FLIP
    }));
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_SWITCH,
      playerType: PlayerType.TOP_PLAYER,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[1].id, [benchSlot]));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(opponent.active).toBe(benchSlot);
    expect(opponent.bench[0].pokemons.cards[0]).toEqual(jasmine.any(TestPokemon));
    expect(player.hand.cards).toEqual([]);
    expect(player.discard.cards).toEqual([trainerCard]);
  });

  it('Should not play Pokemon Reversal when opponent has no benched Pokémon', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

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
