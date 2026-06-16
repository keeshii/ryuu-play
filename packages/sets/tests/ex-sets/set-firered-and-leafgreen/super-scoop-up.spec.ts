import {
  GameMessage,
  PlayCardAction,
  ResolvePromptAction,
  Simulator,
  SlotType,
  TrainerCard,
} from '@ptcg/common';
import { SuperScoopUp } from '../../../src/ex-sets/set-firered-and-leafgreen/super-scoop-up';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Super Scoop Up RG', () => {
  let sim: Simulator;
  let trainerCard: TrainerCard;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    trainerCard = new SuperScoopUp();

    const state = sim.store.state;
    state.players[0].hand.cards = [trainerCard];
  });

  it('Should play Super Scoop Up', () => {
    const { player } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    sim.dispatch(new PlayCardAction(1, index, target));

    const { prompts } = TestUtils.getAll(sim);
    expect(prompts.length).toEqual(2);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Coin flip',
      playerId: player.id,
      message: GameMessage.COIN_FLIP
    }));
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
    }));

    sim.dispatch(new ResolvePromptAction(prompts[1].id, [player.bench[0]]));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.discard.cards).toEqual([trainerCard]);
    expect(player.hand.cards).toEqual([new TestPokemon()]);
    expect(player.bench[0].pokemons.cards).toEqual([]);
  });

  it('Should not play Super Scoop Up when tails', () => {
    const { player } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);
    
    TestUtils.setFlipResults(sim, [false]);

    sim.dispatch(new PlayCardAction(1, index, target));

    const { prompts } = TestUtils.getAll(sim);
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Coin flip',
      playerId: player.id,
      message: GameMessage.COIN_FLIP
    }));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.discard.cards).toEqual([trainerCard]);
    expect(player.hand.cards).toEqual([]);
    expect(player.bench[0]).toEqual(TestUtils.pokemonSlot([new TestPokemon()]));
  });
});
